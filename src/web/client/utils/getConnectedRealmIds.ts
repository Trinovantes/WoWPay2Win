import type { RegionSlug } from '@/common/RegionConfig'
import { regionFiles } from './GameData'

type ReamToConnectedRealmMap = Record<number, number>

const regionRealmMaps: Map<RegionSlug, ReamToConnectedRealmMap> = (() => {
    const maps = new Map<RegionSlug, ReamToConnectedRealmMap>()

    for (const [regionSlug, regionCache] of regionFiles.entries()) {
        const map: Record<number, number> = {}

        for (const connectedRealm of regionCache.connectedRealms) {
            for (const realm of connectedRealm.realms) {
                map[realm.id] = connectedRealm.id
            }
        }

        maps.set(regionSlug, map)
    }

    return maps
})()

export function getConnectedRealmIds(region: RegionSlug, realms: Set<number>): Set<number> {
    const connectedRealms = new Set<number>()

    for (const realm of realms) {
        const cr = regionRealmMaps.get(region)?.[realm]
        if (cr !== undefined) {
            connectedRealms.add(cr)
        }
    }

    return connectedRealms
}
