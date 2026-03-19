import { type Tertiary, isTertiaryBonusId } from '../ItemBonusId.ts'

export function getItemTertiary(bonusIds = new Array<number>()): Tertiary | undefined {
    for (const bonusId of bonusIds) {
        if (isTertiaryBonusId(bonusId)) {
            return bonusId
        }
    }

    return undefined
}
