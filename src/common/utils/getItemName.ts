import type { ItemId } from '../api/BnetResponse.ts'
import type { Item, ItemAuction } from '../Cache.ts'
import { ALL_SECONDARIES } from '../ItemBonusId.ts'
import { regionConfigs, type RegionSlug } from '../RegionConfig.ts'
import { getAuctionSecondary } from './getItemSecondary.ts'

const itemDataFiles: Map<ItemId, Item> = (() => {
    const files = new Map<ItemId, Item>()

    if (__IS_WEBPACK__) {
        const req = require.context(__ITEMS_DATA_DIR__, false, /item-(\d+)\.json$/) // Webpack specific function

        for (const fileName of req.keys()) {
            const matches = /item-(\d+)\.json$/.exec(fileName)
            if (!matches) {
                throw new Error(`Failed to match itemId "${fileName}"`)
            }

            const itemId = Number(matches[1])
            if (isNaN(itemId)) {
                throw new Error('Invalid item id while parsing item file')
            }

            files.set(itemId as ItemId, req(fileName) as Item)
        }
    } else {
        throw new Error('Not implemented')
    }

    return files
})()

export function getItemName(regionSlug: RegionSlug | null, auction: ItemAuction): string {
    if (regionSlug === null) {
        return ''
    }

    const itemName = getItemNameById(auction.itemId, regionSlug)
    const secondaries = getAuctionSecondary(auction)

    if (secondaries.length > 0) {
        const affix = secondaries
            .sort((a, b) => a - b)
            .map((secondaryKey) => ALL_SECONDARIES[secondaryKey].label)
            .join(' / ')

        return `${itemName} (${affix})`
    } else {
        return itemName
    }
}

export function getItemNameById(itemId: ItemId, regionSlug: RegionSlug): string {
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
