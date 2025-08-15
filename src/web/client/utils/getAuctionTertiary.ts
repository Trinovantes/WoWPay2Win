import { isTertiaryBonusId, Tertiary } from '@/common/ItemBonusId'
import { ItemAuction } from '@/common/Cache'

export function getAuctionTertiary(auction: ItemAuction): Tertiary | undefined {
    for (const bonusId of auction.bonusIds ?? []) {
        if (isTertiaryBonusId(bonusId)) {
            return bonusId
        }
    }

    return undefined
}
