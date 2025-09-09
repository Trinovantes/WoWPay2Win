import type { ItemAuction } from '../../../common/Cache.ts'
import { ALL_SECONDARIES } from '../../../common/ItemBonusId.ts'
import type { RegionSlug } from '../../../common/RegionConfig.ts'
import { getAuctionSecondary } from './getAuctionSecondary.ts'
import { getItemNameById } from './getItemNameById.ts'

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
