import { RegionConfigs } from '@common/Constants'
import { Region } from '@cron/models/Region'

export default async function fetchRegions(): Promise<Array<Region>> {
    const regions: Array<Region> = []

    for (const regionConfig of RegionConfigs) {
        const region = new Region(regionConfig)
        await region.fetch()
        regions.push(region)

        // Speed up runs during development
        if (DEFINE.IS_DEV) {
            break
        }
    }

    return regions
}
