// eslint-disable-next-line import/order
import '@/common/utils/setupDayjs'

import path from 'path'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import { SENTRY_DSN } from '@/common/Constants'
import { REGION_CONFIGS } from '@/common/RegionConfig'
import { ApiAccessor } from './api/ApiAccessor'
import { CacheableRegion } from './api/CacheableRegion'
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

    for (const regionConfig of REGION_CONFIGS) {
        const apiAccessor = new ApiAccessor(regionConfig)
        const region = new CacheableRegion(apiAccessor, dataDir, auctionsDir)

        const child = transaction.startChild({ op: 'fetchAuctions', description: region.slug })
        await region.fetch()
        await region.fetchAuctions()
        child.finish()

        // Only run on 1 region during dev
        if (DEFINE.IS_DEV) {
            break
        }
    }

    transaction.finish()
}

main().catch((err) => {
    Sentry.captureException(err)
    console.warn(err)
    process.exit(1)
})
