import type { ConnectedRealmId, RealmId } from '../api/BnetResponse.ts'
import type { Region } from '../Cache.ts'
import type { RegionSlug } from '../RegionConfig.ts'

const regionDataFiles: Map<RegionSlug, Region> = (() => {
    const files = new Map<RegionSlug, Region>()

    if (__IS_WEBPACK__) {
        const req = require.context(__REGIONS_DATA_DIR__, false, /region-(\w+)\.json$/) // Webpack specific function

        for (const fileName of req.keys()) {
            const matches = /region-(\w+)\.json$/.exec(fileName)
            if (!matches) {
                throw new Error(`Failed to match region "${fileName}"`)
            }

            const regionSlug = matches[1] as RegionSlug
            files.set(regionSlug, req(fileName) as Region)
        }
    } else {
        throw new Error('Not implemented')
    }

    return files
})()

type ReamToConnectedRealmMap = Record<RealmId, ConnectedRealmId>

const regionRealmMaps: Map<RegionSlug, ReamToConnectedRealmMap> = (() => {
    const maps = new Map<RegionSlug, ReamToConnectedRealmMap>()

    for (const [regionSlug, regionCache] of regionDataFiles.entries()) {
        const map: Record<RealmId, ConnectedRealmId> = {}

        for (const connectedRealm of regionCache.connectedRealms) {
            for (const realm of connectedRealm.realms) {
                map[realm.id] = connectedRealm.id
            }
        }

        maps.set(regionSlug, map)
    }

    return maps
})()

export function getRegion(region: RegionSlug): Region | undefined {
    if (!regionDataFiles.has(region)) {
        console.warn('Region data file not found during compilation', region, regionDataFiles)
        return undefined
    }

    return regionDataFiles.get(region)
}

export function getRegionRealmIds(region: RegionSlug | null): Array<RealmId> {
    if (region === null) {
        return []
    }

    const connectedRealms = getRegion(region)?.connectedRealms
    if (!connectedRealms) {
        return []
    }

    return connectedRealms.flatMap((cr) => cr.realms.map((r) => r.id))
}

export function getRegionConnectedRealmIds(regionSlug: RegionSlug, realms: Set<RealmId>): Set<ConnectedRealmId> {
    const connectedRealms = new Set<ConnectedRealmId>()

    for (const realm of realms) {
        const cr = regionRealmMaps.get(regionSlug)?.[realm]
        if (cr !== undefined) {
            connectedRealms.add(cr)
        }
    }

    return connectedRealms
}

export function getRegionConnectedRealmName(regionSlug: RegionSlug | null, crId: ConnectedRealmId): string {
    if (regionSlug === null) {
        return ''
    }

    const region = getRegion(regionSlug)
    if (!region) {
        return ''
    }

    for (const connectedRealm of region.connectedRealms) {
        if (connectedRealm.id === crId) {
            return connectedRealm.realms.map((realm) => realm.name).join(', ')
        }
    }

    return ''
}
