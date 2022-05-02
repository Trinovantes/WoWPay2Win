import path from 'path'
import { getAllBoeIds } from '@/common/utils/getAllBoeIds'
import { Item } from '@/cron/models/Item'
import { batchRequests } from '@/cron/utils/batchRequests'
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
    }
}

main().catch((err) => {
    console.warn(err)
    process.exit(1)
})
