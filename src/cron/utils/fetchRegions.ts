import { RegionConfigs } from '@common/Constants'
import { Region } from '@cron/models/Region'

export default async function fetchRegions(dataDir: string, auctionsDir: string): Promise<Array<Region>> {
    const regions: Array<Region> = []

    for (const regionConfig of RegionConfigs) {
        const region = new Region(regionConfig, dataDir, auctionsDir)
        await region.fetch()
        regions.push(region)

        // Speed up runs during development
        if (DEFINE.IS_DEV) {
            break
        }
    }

    return regions
}
