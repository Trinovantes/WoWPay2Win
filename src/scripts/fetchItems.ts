import { getAllBoeIds } from '../common/Boe.ts'
import { ITEMS_DATA_DIR, ITEMS_ICON_DIR, REGIONS_DATA_DIR } from '../common/Constants.ts'
import { regionConfigs } from '../common/RegionConfig.ts'
import { ApiAccessor } from '../common/api/ApiAccessor.ts'
import { CacheableItem } from '../common/api/CacheableItem.ts'
import { CacheableRegion } from '../common/api/CacheableRegion.ts'
import { getTierConfigMap } from '../common/node/getTierConfigMap.ts'

async function main() {
    const tierConfigMap = await getTierConfigMap()
    const boeIds = getAllBoeIds(tierConfigMap)

    for (const regionConfig of regionConfigs) {
        const apiAccessor = new ApiAccessor(regionConfig)
        const region = new CacheableRegion(apiAccessor, REGIONS_DATA_DIR, '/dev/null')
        await region.fetchRegionData()

        for (const itemId of boeIds) {
            const item = new CacheableItem(apiAccessor, itemId, ITEMS_DATA_DIR, ITEMS_ICON_DIR)
            await item.fetchItemData()
            await item.fetchItemIcon()
        }
    }
}

main().catch((err) => {
    console.warn(err)
    process.exit(1)
})
