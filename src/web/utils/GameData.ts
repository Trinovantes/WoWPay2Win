import { ItemData, RegionCache } from '@/common/Data'
import { getRegionLocale, RegionSlug } from '@/common/Constants'

// ----------------------------------------------------------------------------
// Load Data
// ----------------------------------------------------------------------------

function getRegionFiles(): Map<RegionSlug, RegionCache> {
    const req = require.context('@/web/assets/data', false, /region-(\w+)\.json$/)
    const files = new Map<RegionSlug, RegionCache>()

    for (const fileName of req.keys()) {
        const matches = /region-(\w+)\.json$/.exec(fileName)
        if (!matches) {
            throw new Error(`Failed to match region "${fileName}"`)
        }

        const regionSlug = matches[1] as RegionSlug
        files.set(regionSlug, req(fileName) as RegionCache)
    }

    return files
}

function getItemFiles(): Map<number, ItemData> {
    const req = require.context('@/web/assets/data', false, /item-(\d+)\.json$/)
    const files = new Map<number, ItemData>()

    for (const fileName of req.keys()) {
        const matches = /item-(\d+)\.json$/.exec(fileName)
        if (!matches) {
            throw new Error(`Failed to match itemId "${fileName}"`)
        }

        const itemId = Number(matches[1])
        if (isNaN(itemId)) {
            throw new Error('Invalid item id while parsing item file')
        }

        files.set(itemId, req(fileName) as ItemData)
    }

    return files
}

const regionFiles = getRegionFiles()
const itemFiles = getItemFiles()

// ----------------------------------------------------------------------------
// Exports
// ----------------------------------------------------------------------------

export function getRegionData(region: RegionSlug): RegionCache | undefined {
    if (!regionFiles.has(region)) {
        console.warn('Region data file not found during compilation', region, regionFiles)
        return undefined
    }

    return regionFiles.get(region)
}

export function getWowheadItemLinkById(itemId: number, region: RegionSlug): string {
    let domain: string
    switch (region) {
        case RegionSlug.KR:
            domain = 'ko'
            break
        default:
            domain = 'www'
    }

    return `https://${domain}.wowhead.com/item=${itemId}`
}

export function getItemNameById(itemId: number, region: RegionSlug): string {
    if (!itemFiles.has(itemId)) {
        console.warn('Item data file not found during compilation', itemId, itemFiles)
        return `Item ${itemId}`
    }

    const itemCache = itemFiles.get(itemId)
    const locale = getRegionLocale(region)
    return itemCache?.localizedName[locale] ?? ''
}

export function getBaseIlvl(itemId: number): number {
    if (!itemFiles.has(itemId)) {
        console.warn('Item data file not found during compilation', itemId, itemFiles)
        return NaN
    }

    const itemCache = itemFiles.get(itemId)
    return itemCache?.baseLevel ?? 0
}

type ReamToConnectedRealmMap = Record<number, number>
export const realmToConnectedRealmMaps = createConnectedRealmMaps()

function createConnectedRealmMaps(): Map<RegionSlug, ReamToConnectedRealmMap> {
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
}
