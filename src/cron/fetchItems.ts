import { getBoeIds } from '@common/Constants'
import { batchRequests } from '@common/utils'
import { Item } from '@cron/models/Item'
import { Region } from '@cron/models/Region'
import fetchRegions from '@cron/utils/fetchRegions'

async function fetchItems(region: Region, dataDir: string, imgDir: string) {
    const boeIds = getBoeIds()

    await batchRequests(boeIds.length, async(idx) => {
        const item = new Item(region, boeIds[idx], dataDir, imgDir)
        await item.fetch()
    })
}

async function main() {
    if (process.argv.length !== 5) {
        console.info(process.argv)
        throw new Error('Expected dataDir, auctionsDir, imgDir as arguments')
    }

    const dataDir = process.argv[2]
    const auctionsDir = process.argv[3]
    const imgDir = process.argv[4]
    console.info('dataDir     =', dataDir)
    console.info('auctionsDir =', auctionsDir)
    console.info('imgDir      =', imgDir)

    const regions = await fetchRegions(dataDir, auctionsDir)

    for (const region of regions) {
        await fetchItems(region, dataDir, imgDir)
    }

    console.info('Cron Script Finished')
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((err) => {
        const error = err as Error
        console.error('Cron Script Failed:', error.name, error.message)

        if (DEFINE.IS_DEV) {
            console.error(error.stack)
        }

        process.exit(1)
    })
