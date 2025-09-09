import { type RegionSlug, regionConfigs } from '../../../common/RegionConfig.ts'
import { itemDataFiles } from './GameData.ts'

export function getItemNameById(itemId: number, regionSlug: RegionSlug): string {
    if (!itemDataFiles.has(itemId)) {
        console.warn('Item data file not found during compilation', itemId, itemDataFiles)
        return `Item ${itemId}`
    }

    const itemCache = itemDataFiles.get(itemId)
    if (!itemCache) {
        return ''
    }

    const locale = regionConfigs.find((region) => region.slug === regionSlug)?.locale
    if (locale === undefined) {
        return ''
    }

    const localeName = itemCache.localizedName[locale]
    if (localeName) {
        return localeName
    }

    for (const name of Object.values(itemCache.localizedName)) {
        if (name) {
            return name
        }
    }

    return ''
}
