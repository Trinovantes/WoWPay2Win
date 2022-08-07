import { isSecondaryBonusId } from '@/common/BonusId'

export function getItemSecondaryAffix(bonusIds: Array<number>): string {
    for (const id of bonusIds) {
        const secondary = isSecondaryBonusId(id)
        if (secondary) {
            return secondary
        }
    }

    return ''
}
