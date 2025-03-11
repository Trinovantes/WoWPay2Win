import * as Sentry from '@sentry/node'
import { AUCTIONS_DATA_DIR, REGIONS_DATA_DIR, SENTRY_DSN } from '@/common/Constants'
import { regionConfigs } from '@/common/RegionConfig'
import { ApiAccessor } from './api/ApiAccessor'
import { CacheableRegion } from './api/CacheableRegion'
import { getTierConfigMap } from './utils/getTierConfigMap'
import { getAllBoeIds } from '@/common/Boe'

// ----------------------------------------------------------------------------
// MARK: Helpers
// ----------------------------------------------------------------------------

async function fetchAuctions() {
    const tierConfigMap = await getTierConfigMap()
    const boeIds = getAllBoeIds(tierConfigMap)

    for (const regionConfig of regionConfigs) {
        const apiAccessor = new ApiAccessor(regionConfig)
        const region = new CacheableRegion(apiAccessor, REGIONS_DATA_DIR, AUCTIONS_DATA_DIR)

        await region.fetchRegionData()
        await region.fetchRegionAuctions(boeIds)

        // Only run on 1 region during dev
        if (DEFINE.IS_DEV) {
            break
        }
    }
}

// ----------------------------------------------------------------------------
// MARK: Main
// ----------------------------------------------------------------------------

async function main() {
    Sentry.init({
        dsn: SENTRY_DSN,
        release: DEFINE.GIT_HASH,
        tracesSampleRate: 0.1,
        profilesSampleRate: 0.0,
        enabled: !DEFINE.IS_DEV,
    })

    await Sentry.startSpan({
        op: 'fetchAuctions',
        name: 'Fetch Auctions Cron Job',
    }, async() => {
        try {
            await fetchAuctions()
        } catch (err) {
            console.error(err)
            Sentry.captureException(err)
        }
    })
}

main().catch((err) => {
    console.warn(err)
    process.exit(1)
})
