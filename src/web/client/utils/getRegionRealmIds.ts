import type { RegionSlug } from '@/common/RegionConfig'
import { getRegion } from './getRegion'

export function getRegionRealmIds(region: RegionSlug | null): Array<number> {
    if (region === null) {
        return []
    }

    const connectedRealms = getRegion(region)?.connectedRealms
    if (!connectedRealms) {
        return []
    }

    return connectedRealms.flatMap((cr) => cr.realms.map((r) => r.id))
}
