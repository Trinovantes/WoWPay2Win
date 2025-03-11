import { isTertiaryBonusId, Tertiary } from '@/common/BonusId'
import { ItemAuction } from '@/common/Cache'

export function getAuctionTertiary(auction: ItemAuction): Tertiary | undefined {
    for (const bonusId of auction.bonuses) {
        if (isTertiaryBonusId(bonusId)) {
            return bonusId
        }
    }

    return undefined
}
