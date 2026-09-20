import type { Upgrade } from '../ItemBonusId.ts'
import type { UpgradeBonusIdsCacheFile } from '../../scripts/fetchBonusIds.ts'
import type { BonusId } from '../api/BnetResponse.ts'

const upgradeBonusIds = await (async (): Promise<Map<BonusId, Upgrade>> => {
    if (__IS_WEBPACK__) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return new Map(require(__UPGRADE_BONUS_ID_DATA_FILE__) as UpgradeBonusIdsCacheFile) // Webpack specific function
    } else {
        const fs = await import('node:fs')
        const fileContents = fs.readFileSync(__UPGRADE_BONUS_ID_DATA_FILE__).toString('utf8')
        const fileData = JSON.parse(fileContents) as UpgradeBonusIdsCacheFile
        return new Map(fileData)
    }
})()

export const UPGRADE_LIMIT = (() => {
    let min = 1
    let max = 1

    for (const upgrade of upgradeBonusIds.values()) {
        if (upgrade.currentLvl < min) {
            min = upgrade.currentLvl
        }
        if (upgrade.maxLvl > max) {
            max = upgrade.maxLvl
        }
    }

    return {
        MIN: min,
        MAX: max,
    }
})()

export function getItemUpgrade(bonusIds = new Array<BonusId>()): Upgrade | undefined {
    for (const bonusId of bonusIds) {
        const upgrade = upgradeBonusIds.get(bonusId)
        if (upgrade) {
            return upgrade
        }
    }

    return undefined
}
