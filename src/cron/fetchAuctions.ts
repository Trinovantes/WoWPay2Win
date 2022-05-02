// eslint-disable-next-line import/order
import '@/common/utils/setupDayjs'

import path from 'path'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import { SENTRY_DSN } from '@/common/Constants'
import { unrecognizedBonusIdTracker } from '@/cron/utils/UnrecognizedBonusIdTracker'
import { fetchRegions } from './utils/fetchRegions'
import { mkdirp } from './utils/mkdirp'

Tracing.addExtensionMethods()

Sentry.init({
    dsn: SENTRY_DSN,
    release: DEFINE.GIT_HASH,
    tracesSampleRate: 1.0,
    enabled: !DEFINE.IS_DEV,
})

async function main() {
    if (process.argv.length !== 4) {
        console.info(process.argv)
        throw new Error('Expected dataDir and auctionsDir as arguments')
    }

    const dataDir = path.resolve(process.argv[2])
    const auctionsDir = path.resolve(process.argv[3])
    console.table({
        dataDir,
        auctionsDir,
    })

    mkdirp(dataDir)
    mkdirp(auctionsDir)

    const transaction = Sentry.startTransaction({
        op: 'fetchAuctions',
        name: 'Fetch Auctions Cron Job',
    })

    const child = transaction.startChild({ op: 'fetchRegions' })
    const regions = await fetchRegions(dataDir, auctionsDir)
    child.finish()

    for (const region of regions) {
        const child = transaction.startChild({ op: 'fetchAuctions', description: region.config.slug })
        await region.fetchAuctions()
        child.finish()
    }

    unrecognizedBonusIdTracker.print()
    transaction.finish()
}

main().catch((err) => {
    console.warn(err)
    Sentry.captureException(err)
    process.exit(1)
})
