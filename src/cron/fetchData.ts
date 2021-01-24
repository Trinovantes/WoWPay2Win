import { getBoeIds } from '@common/Constants'
import { batchRequests } from '@common/utils'
import { Item } from './models/Item'
import { Region } from './models/Region'
import fetchRegions from './utils/fetchRegions'

async function fetchItems(region: Region) {
    const boeIds = getBoeIds()

    await batchRequests(boeIds.length, async(idx) => {
        const item = new Item(region, boeIds[idx])
        await item.fetch()
    })
}

async function main() {
    const regions = await fetchRegions()

    for (const region of regions) {
        await fetchItems(region)
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
