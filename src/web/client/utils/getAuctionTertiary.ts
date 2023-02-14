import { isTertiaryBonusId, Tertiary } from '@/common/BonusId'
import type { ItemAuction } from '@/common/Cache'

export function getAuctionTertiary(auction: ItemAuction): Tertiary | undefined {
    for (const bonusId of auction.bonuses) {
        const tertiary = isTertiaryBonusId(bonusId)
        if (tertiary !== undefined) {
            return tertiary
        }
    }

    return undefined
}
