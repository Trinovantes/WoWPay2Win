import type { RegionSlug } from '../../../common/RegionConfig.ts'
import { getRegion } from './getRegion.ts'

export function getConnectedRealmName(regionSlug: RegionSlug | null, crId: number): string {
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
