import type { ItemAuction } from '../../../common/Cache.ts'
import { type Tertiary, isTertiaryBonusId } from '../../../common/ItemBonusId.ts'

export function getAuctionTertiary(auction: ItemAuction): Tertiary | undefined {
    for (const bonusId of auction.bonusIds ?? []) {
        if (isTertiaryBonusId(bonusId)) {
            return bonusId
        }
    }

    return undefined
}
