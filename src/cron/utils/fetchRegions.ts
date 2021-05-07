import { REGION_CONFIGS } from '@/common/Constants'
import { Region } from '@/cron/models/Region'

export async function fetchRegions(dataDir: string, auctionsDir?: string): Promise<Array<Region>> {
    const regions: Array<Region> = []

    for (const regionConfig of REGION_CONFIGS) {
        const region = new Region(regionConfig, dataDir, auctionsDir)
        await region.fetch()
        regions.push(region)
    }

    return regions
}
