import { ItemAuction } from '@/common/Cache'
import { getItemNameById } from './getItemNameById'
import { RegionSlug } from '@/common/RegionConfig'
import { getAuctionSecondary } from './getAuctionSecondary'
import { ALL_SECONDARIES } from '@/common/ItemBonusId'

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
