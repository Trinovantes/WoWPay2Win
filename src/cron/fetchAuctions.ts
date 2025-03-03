import path from 'node:path'
import * as Sentry from '@sentry/node'
import { SENTRY_DSN } from '@/common/Constants'
import { regionConfigs } from '@/common/RegionConfig'
import { ApiAccessor } from './api/ApiAccessor'
import { CacheableRegion } from './api/CacheableRegion'
import { mkdirp } from './utils/mkdirp'

Sentry.init({
    dsn: SENTRY_DSN,
    release: DEFINE.GIT_HASH,
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.0,
    enabled: !DEFINE.IS_DEV,
})

async function fetchAuctions(dataDir: string, auctionsDir: string) {
    for (const regionConfig of regionConfigs) {
        const apiAccessor = new ApiAccessor(regionConfig)
        const region = new CacheableRegion(apiAccessor, dataDir, auctionsDir)

        await region.fetch()
        await region.fetchAuctions()

        // Only run on 1 region during dev
        if (DEFINE.IS_DEV) {
            break
        }
    }
}

async function main() {
    if (process.argv.length !== 4) {
        console.info(process.argv)
        throw new Error('Expected dataDir and auctionsDir as arguments')
    }

    const dataDir = path.resolve(process.argv[2])
    const auctionsDir = path.resolve(process.argv[3])
    mkdirp(dataDir)
    mkdirp(auctionsDir)

    await Sentry.startSpan({
        op: 'fetchAuctions',
        name: 'Fetch Auctions Cron Job',
    }, async() => {
        try {
            await fetchAuctions(dataDir, auctionsDir)
        } catch (err) {
            console.error(err)
            Sentry.captureException(err)
        }
    })
}

main().catch((err: unknown) => {
    console.warn(err)
    process.exit(1)
})
