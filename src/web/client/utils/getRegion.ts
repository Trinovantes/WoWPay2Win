import { Region } from '@/common/Cache'
import { RegionSlug } from '@/common/RegionConfig'
import { regionDataFiles } from './GameData'

export function getRegion(region: RegionSlug): Region | undefined {
    if (!regionDataFiles.has(region)) {
        console.warn('Region data file not found during compilation', region, regionDataFiles)
        return undefined
    }

    return regionDataFiles.get(region)
}
