import { getSecondaryAffix } from '@/common/BonusId'

export function getItemSecondaryAffix(bonusIds: Array<number>): string | undefined {
    for (const id of bonusIds) {
        const secondary = getSecondaryAffix(id)
        if (secondary !== undefined) {
            return secondary
        }
    }

    return undefined
}
