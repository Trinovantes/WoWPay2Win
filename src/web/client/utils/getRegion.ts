import type { Region } from '@/common/Cache'
import type { RegionSlug } from '@/common/RegionConfig'
import { regionFiles } from './GameData'

export function getRegion(region: RegionSlug): Region | undefined {
    if (!regionFiles.has(region)) {
        console.warn('Region data file not found during compilation', region, regionFiles)
        return undefined
    }

    return regionFiles.get(region)
}
