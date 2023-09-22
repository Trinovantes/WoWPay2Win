import path from 'path'
import { REGION_CONFIGS } from '@/common/RegionConfig'
import { getAllBoeIds } from '@/common/utils/getAllBoeIds'
import { ApiAccessor } from './api/ApiAccessor'
import { CacheableItem } from './api/CacheableItem'
import { CacheableRegion } from './api/CacheableRegion'
import { batchRequests } from './utils/batchRequests'
import { mkdirp } from './utils/mkdirp'

async function main() {
    if (process.argv.length !== 4) {
        console.info(process.argv)
        throw new Error('Expected dataDir and imgDir as arguments')
    }

    const dataDir = path.resolve(process.argv[2])
    const imgDir = path.resolve(process.argv[3])
    console.table({
        dataDir,
        imgDir,
    })
    mkdirp(dataDir)
    mkdirp(imgDir)

    for (const regionConfig of REGION_CONFIGS) {
        const apiAccessor = new ApiAccessor(regionConfig)
        const region = new CacheableRegion(apiAccessor, dataDir, '/dev/null')
        await region.fetch()

        const boeIds = getAllBoeIds()
        await batchRequests(boeIds.length, async(idx) => {
            const itemId = boeIds[idx]
            const item = new CacheableItem(apiAccessor, itemId, dataDir, imgDir)
            await item.fetch()
        })
    }
}

main().catch((err) => {
    console.warn(err)
    process.exit(1)
})
