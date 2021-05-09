import path from 'path'
import { getAllBoeIds } from '@/common/utils'
import { batchRequests } from '@/cron/utils/batchRequests'
import { Item } from '@/cron/models/Item'
import { fetchRegions } from './utils/fetchRegions'
import { mkdirp } from './utils/mkdirp'

async function main() {
    if (process.argv.length !== 4) {
        console.info(process.argv)
        throw new Error('Expected dataDir, imgDir as arguments')
    }

    const dataDir = path.resolve(process.argv[2])
    const imgDir = path.resolve(process.argv[3])
    console.table({
        dataDir,
        imgDir,
    })

    mkdirp(dataDir)
    mkdirp(imgDir)

    const regions = await fetchRegions(dataDir)
    for (const region of regions) {
        const boeIds = getAllBoeIds()
        await batchRequests(boeIds.length, async(idx) => {
            const item = new Item(region, boeIds[idx], dataDir, imgDir)
            await item.fetch()
        })

        if (DEFINE.IS_DEV) {
            break
        }
    }
}

main()
    .then(() => {
        console.info('fetchItems Finished')
        process.exit(0)
    })
    .catch((err) => {
        const error = err as Error
        console.warn('fetchItems Failed')
        console.warn(error.stack)
        process.exit(1)
    })
