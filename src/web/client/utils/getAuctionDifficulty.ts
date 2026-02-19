import type { ItemAuction } from '../../../common/Cache.ts'
import { DIFFICULTY, type Difficulty } from '../../../common/ItemBonusId.ts'
import type { DifficultyBonusIdsCacheFile } from '../../../scripts/fetchBonusIds.ts'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const difficultyBonusIds = new Map(require(__DIFFICULTY_BONUS_ID_DATA_FILE__) as DifficultyBonusIdsCacheFile) // Webpack specific function

export function getAuctionDifficulty(auction: ItemAuction): Difficulty | undefined {
    for (const bonusId of auction.bonusIds ?? []) {
        if (difficultyBonusIds.has(bonusId)) {
            return difficultyBonusIds.get(bonusId)
        }
    }

    return DIFFICULTY.NORMAL
}
