import Constants, { RegionConfigs } from '@common/Constants'
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

async function main() {
    try {
        const regions = await fetchRegions()

        for (const region of regions) {
            await region.fetchAuctions()
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
