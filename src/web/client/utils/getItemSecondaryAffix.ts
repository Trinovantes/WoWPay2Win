import { isSecondaryBonusId } from '@/common/BonusId'

export function getItemSecondaryAffix(bonusIds: Array<number>): string {
    for (const id of bonusIds) {
        const secondary = isSecondaryBonusId(id)
        if (secondary !== undefined) {
            return secondary
        }
    }

    return ''
}
