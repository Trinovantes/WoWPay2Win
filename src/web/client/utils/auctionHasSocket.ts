import { isSocketBonusId } from '@/common/BonusId'
import type { ItemAuction } from '@/common/Cache'

export function auctionHasSocket(auction: ItemAuction): boolean {
    for (const bonusId of auction.bonuses) {
        if (isSocketBonusId(bonusId)) {
            return true
        }
    }

    return false
}
