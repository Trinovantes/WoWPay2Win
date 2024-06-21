import { ItemAuction } from '@/common/Cache'
import { getItemNameById } from './getItemNameById'
import { getItemSecondaryAffix } from './getItemSecondaryAffix'
import { RegionSlug } from '@/common/RegionConfig'

export function getItemName(regionSlug: RegionSlug | null, auction: ItemAuction): string {
    if (regionSlug === null) {
        return ''
    }

    const itemName = getItemNameById(auction.itemId, regionSlug)
    const affix = getItemSecondaryAffix(auction.bonuses)

    if (affix) {
        return `${itemName} (${affix})`
    } else {
        return itemName
    }
}
