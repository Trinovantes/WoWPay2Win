import { ItemData, RegionCache } from '@/common/Data'
import { getRegionLocale, RegionSlug } from '@/common/Constants'

// ----------------------------------------------------------------------------
// Load Data
// ----------------------------------------------------------------------------

function getRegionFiles(): Record<RegionSlug, RegionCache> {
    const req = require.context('@/web/assets/data', false, /region-(\w+)\.json$/)
    const files: Partial<Record<RegionSlug, RegionCache>> = {}

    for (const fileName of req.keys()) {
        const matches = /region-(\w+)\.json$/.exec(fileName)
        if (matches) {
            const regionSlug = matches[1] as RegionSlug
            files[regionSlug] = req(fileName) as RegionCache
        }
    }

    return files as Record<RegionSlug, RegionCache>
}

function getItemFiles(): Record<number, ItemData> {
    const req = require.context('@/web/assets/data', false, /item-(\d+)\.json$/)
    const files: Record<number, ItemData> = {}

    for (const fileName of req.keys()) {
        const matches = /item-(\d+)\.json$/.exec(fileName)
        if (matches) {
            const itemId = Number(matches[1])
            if (isNaN(itemId)) {
                throw new Error('Invalid item id while parsing item file')
            }

            files[itemId] = req(fileName) as ItemData
        }
    }

    return files
}

const regionFiles = getRegionFiles()
const itemFiles = getItemFiles()

// ----------------------------------------------------------------------------
// Exports
// ----------------------------------------------------------------------------

export function getRegionData(region: RegionSlug): RegionCache | null {
    if (!(region in regionFiles)) {
        console.warn('Region data file not found during compilation', region, regionFiles)
        return null
    }

    return regionFiles[region]
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
    if (!(itemId in itemFiles)) {
        console.warn('Item data file not found during compilation', itemId, itemFiles)
        return `Item ${itemId}`
    }

    const itemCache = itemFiles[itemId]
    const locale = getRegionLocale(region)
    return itemCache.localizedName[locale] ?? ''
}

export function getBaseIlvl(itemId: number): number {
    if (!(itemId in itemFiles)) {
        console.warn('Item data file not found during compilation', itemId, itemFiles)
        return NaN
    }

    const itemCache = itemFiles[itemId]
    return itemCache.baseLevel
}

type ConnectedRealmMap = Record<number, number>
export const realmToConnectedRealmMap = createConnectedRealmMap()

function createConnectedRealmMap(): Record<RegionSlug, ConnectedRealmMap> {
    const maps: Partial<Record<RegionSlug, ConnectedRealmMap>> = {}

    for (const [regionSlug, regionCache] of Object.entries(regionFiles)) {
        const map: Record<number, number> = {}

        for (const connectedRealm of regionCache.connectedRealms) {
            for (const realm of connectedRealm.realms) {
                map[realm.id] = connectedRealm.id
            }
        }

        maps[regionSlug as RegionSlug] = map
    }

    return maps as Record<RegionSlug, ConnectedRealmMap>
}
