import { isIlvlBonusId } from '@/common/BonusId'
import type { ItemAuction } from '@/common/Cache'
import { itemFiles } from './GameData'

export function getAuctionIlvl(auction: ItemAuction): number {
    if (!itemFiles.has(auction.itemId)) {
        console.warn('Item data file not found during compilation', auction.itemId, itemFiles)
        return NaN
    }

    let bonusIlvl: number | undefined = 0
    for (const bonusId of auction.bonuses) {
        bonusIlvl = isIlvlBonusId(bonusId)
        if (bonusIlvl !== undefined) {
            break
        }
    }

    const itemCache = itemFiles.get(auction.itemId)
    return (itemCache?.baseLevel ?? 0) + (bonusIlvl ?? 0)
}
