import { ItemAuction } from '@/common/Cache'
import { Secondary } from '@/common/ItemBonusId'
import { getSecondaryFromModifiers } from '@/common/ItemModifier'
import { CachedSecondaryIdsFile } from '@/scripts/fetchSecondaryIds'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const secondaryBonusIds = new Map(require(DEFINE.SECONDARY_BONUS_ID_DATA_FILE) as CachedSecondaryIdsFile) // Webpack specific function

export function getAuctionSecondary(auction: ItemAuction): Array<Secondary> {
    return [
        ...(getSecondaryFromBonusIds(auction.bonusIds) ?? []),
        ...(getSecondaryFromModifiers(auction.modifiers) ?? []),
    ]
}

function getSecondaryFromBonusIds(bonusIds?: Array<number>) {
    for (const bonusId of bonusIds ?? []) {
        const secondaries = secondaryBonusIds.get(bonusId)
        if (!secondaries) {
            continue
        }

        return secondaries
    }

    return undefined
}
