import { fetchRegions } from './utils/fetchRegions'
import { unrecognizedBonusIdTracker } from '@/cron/utils/UnrecognizedBonusIdTracker'
import path from 'path'
import { mkdirp } from './utils/mkdirp'
import { SENTRY_DSN } from '@/common/Constants'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'

Tracing.addExtensionMethods()

Sentry.init({
    dsn: SENTRY_DSN,
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

    try {
        const child = transaction.startChild({ op: 'fetchRegions' })
        const regions = await fetchRegions(dataDir, auctionsDir)
        child.finish()

        for (const region of regions) {
            const child = transaction.startChild({ op: `fetchAuctions:${region.config.slug}` })
            await region.fetchAuctions()
            child.finish()

            if (DEFINE.IS_DEV) {
                break
            }
        }
    } catch (err) {
        Sentry.captureException(err)
    } finally {
        transaction.finish()
    }

    unrecognizedBonusIdTracker.print()
}

main().catch((err) => {
    console.warn(err)
    process.exit(1)
})
