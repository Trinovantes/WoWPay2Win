import type { ItemAuction } from '../../../common/Cache.ts'
import type { Secondary } from '../../../common/ItemBonusId.ts'
import { getSecondaryFromModifiers } from '../../../common/ItemModifier.ts'
import type { SecondaryBonusIdsCacheFile } from '../../../scripts/fetchBonusIds.ts'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const secondaryBonusIds = new Map(require(__SECONDARY_BONUS_ID_DATA_FILE__) as SecondaryBonusIdsCacheFile) // Webpack specific function

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
