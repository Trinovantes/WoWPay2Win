import { DIFFICULTY, type Difficulty } from '../ItemBonusId.ts'
import type { DifficultyBonusIdsCacheFile } from '../../scripts/fetchBonusIds.ts'

const difficultyBonusIds = await (async (): Promise<Map<number, Difficulty>> => {
    if (__IS_WEBPACK__) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return new Map(require(__DIFFICULTY_BONUS_ID_DATA_FILE__) as DifficultyBonusIdsCacheFile) // Webpack specific function
    } else {
        const fs = await import('node:fs')
        const fileContents = fs.readFileSync(__DIFFICULTY_BONUS_ID_DATA_FILE__).toString('utf8')
        const fileData = JSON.parse(fileContents) as DifficultyBonusIdsCacheFile
        return new Map(fileData)
    }
})()

export function getItemDifficulty(bonusIds = new Array<number>()): Difficulty | undefined {
    for (const bonusId of bonusIds) {
        if (difficultyBonusIds.has(bonusId)) {
            return difficultyBonusIds.get(bonusId)
        }
    }

    return DIFFICULTY.NORMAL
}
