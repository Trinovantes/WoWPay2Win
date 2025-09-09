import type { Region } from '../../../common/Cache.ts'
import type { RegionSlug } from '../../../common/RegionConfig.ts'
import { regionDataFiles } from './GameData.ts'

export function getRegion(region: RegionSlug): Region | undefined {
    if (!regionDataFiles.has(region)) {
        console.warn('Region data file not found during compilation', region, regionDataFiles)
        return undefined
    }

    return regionDataFiles.get(region)
}
