import Constants, { getBoeIds, RegionConfigs } from '@common/Constants'
import { Item } from './models/Item'
import { Region } from './models/Region'

async function fetchRegions() {
    const regions: Array<Region> = []

    for (const regionConfig of RegionConfigs) {
        const region = new Region(regionConfig)
        await region.fetch()
        regions.push(region)
    }

    return regions
}

async function fetchItems(region: Region) {
    const boeIds = getBoeIds()

    for (const id of boeIds) {
        const item = new Item(region, id)
        await item.fetch()
    }
}

async function main() {
    try {
        const regions = await fetchRegions()

        for (const region of regions) {
            await fetchItems(region)
        }
    } catch (err) {
        const error = err as Error
        console.error('Cron Script Failed:', error.message)
        if (Constants.IS_DEV) {
            console.error(error.stack)
        }
    } finally {
        console.info('Cron Script Finished')
    }
}

void main()
