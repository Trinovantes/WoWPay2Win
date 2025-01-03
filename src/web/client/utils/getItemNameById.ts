import { RegionSlug, regionConfigs } from '@/common/RegionConfig'
import { itemFiles } from './GameData'

export function getItemNameById(itemId: number, regionSlug: RegionSlug): string {
    if (!itemFiles.has(itemId)) {
        console.warn('Item data file not found during compilation', itemId, itemFiles)
        return `Item ${itemId}`
    }

    const itemCache = itemFiles.get(itemId)
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
