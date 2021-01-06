import Constants, { getBoeIds } from '@common/Constants'
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
    try {
        const regions = await fetchRegions()

        for (const region of regions) {
            await fetchItems(region)
        }

        console.info('Cron Script Finished')
    } catch (err) {
        const error = err as Error
        console.error('Cron Script Failed:', error.message)
        if (Constants.IS_DEV) {
            console.error(error.stack)
        }
        process.exit(1)
    }
}

void main()
