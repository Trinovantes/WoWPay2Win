import * as Sentry from '@sentry/node'
import { ApiAccessor } from '../common/api/ApiAccessor.ts'
import { CacheableRegion } from '../common/api/CacheableRegion.ts'
import { getAllBoeIds } from '../common/Boe.ts'
import { regionConfigs } from '../common/RegionConfig.ts'
import { AUCTIONS_DATA_DIR, REGIONS_DATA_DIR, SENTRY_DSN } from '../common/Constants.ts'
import { getTierConfigMap } from '../common/node/getTierConfigMap.ts'
import { mkdirp } from '../common/node/mkdirp.ts'

// ----------------------------------------------------------------------------
// MARK: Helpers
// ----------------------------------------------------------------------------

async function fetchAuctions() {
    mkdirp(AUCTIONS_DATA_DIR)

    const tierConfigMap = await getTierConfigMap()
    const boeIds = getAllBoeIds(tierConfigMap)

    for (const regionConfig of regionConfigs) {
        const apiAccessor = new ApiAccessor(regionConfig)
        const region = new CacheableRegion(apiAccessor, REGIONS_DATA_DIR, AUCTIONS_DATA_DIR)

        await region.fetchRegionData()
        await region.fetchRegionAuctions(boeIds)

        // Only run on 1 region during dev
        if (__IS_DEV__) {
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
        release: __GIT_HASH__,
        tracesSampleRate: 0.1,
        profilesSampleRate: 0.0,
        enabled: !__IS_DEV__,
    })

    await Sentry.startSpan({
        op: 'fetchAuctions',
        name: 'Fetch Auctions Cron Job',
    }, async () => {
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
