import { isTertiaryBonusId, Tertiary } from '@/common/BonusId'
import type { ItemAuction } from '@/common/Cache'

export function getAuctionTertiary(auction: ItemAuction): Tertiary | undefined {
    for (const bonusId of auction.bonuses) {
        const tertiary = isTertiaryBonusId(bonusId)

        if (tertiary) {
            return tertiary
        }
    }

    return undefined
}
