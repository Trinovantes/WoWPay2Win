import { isIlvlBonusId } from '@/common/BonusId'
import { ItemAuction } from '@/common/Cache'
import { itemDataFiles } from './GameData'

export function getAuctionIlvl(auction: ItemAuction): number {
    if (!itemDataFiles.has(auction.itemId)) {
        console.warn('Item data file not found during compilation', auction.itemId, itemDataFiles)
        return NaN
    }

    let bonusIlvl: number | undefined = 0
    for (const bonusId of auction.bonuses) {
        bonusIlvl = isIlvlBonusId(bonusId)
        if (bonusIlvl !== undefined) {
            break
        }
    }

    const itemCache = itemDataFiles.get(auction.itemId)
    return (itemCache?.baseLevel ?? 0) + (bonusIlvl ?? 0)
}
