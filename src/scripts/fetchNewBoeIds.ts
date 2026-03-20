import { getAllBoeIds } from '../common/Boe.ts'
import { AUCTIONS_DATA_DIR, REGIONS_DATA_DIR } from '../common/Constants.ts'
import { regionConfigs } from '../common/RegionConfig.ts'
import { ApiAccessor } from '../common/api/ApiAccessor.ts'
import { CacheableRegion } from '../common/api/CacheableRegion.ts'
import { tierConfigMap } from '../common/utils/getTierConfigMap.ts'

async function main() {
    const naRegionConfig = regionConfigs[0]
    const apiAccessor = new ApiAccessor(naRegionConfig)
    const naRegion = new CacheableRegion(apiAccessor, REGIONS_DATA_DIR, AUCTIONS_DATA_DIR)
    await naRegion.fetchRegionData()

    const boeIds = getAllBoeIds(tierConfigMap)
    const newBoeIds = await naRegion.fetchNewBoeIds(boeIds)

    console.info(newBoeIds)
}

main().catch((err) => {
    console.warn(err)
    process.exit(1)
})
