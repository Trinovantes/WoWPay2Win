import Constants, { RegionConfigs } from '@common/Constants'
import { Region } from '@cron/models/Region'

export default async function fetchRegions(): Promise<Array<Region>> {
    const regions: Array<Region> = []

    if (Constants.IS_DEV) {
        const region = new Region(RegionConfigs[RegionConfigs.length - 1])
        await region.fetch()
        regions.push(region)
    } else {
        for (const regionConfig of RegionConfigs) {
            const region = new Region(regionConfig)
            await region.fetch()
            regions.push(region)
        }
    }

    return regions
}
