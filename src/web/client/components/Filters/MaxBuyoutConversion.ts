import { GOLD_CAP } from '../../../../common/Constants.ts'

const SLIDER_TIERS = [
    [25, 100 * 1000],
    [50, 500 * 1000],
    [75, 1000 * 1000],
    [100, GOLD_CAP],
]

export function convertPositionToGold(pos: number): number {
    let posMin = 0
    let goldMin = 0

    for (const [posMax, goldMax] of SLIDER_TIERS) {
        if (pos <= posMax) {
            const scale = (goldMax - goldMin) / (posMax - posMin)
            const gold = goldMin + scale * (pos - posMin)
            return gold
        }

        posMin = posMax
        goldMin = goldMax
    }

    throw new Error(`Invalid slider position for conversion ${pos}`)
}

export function convertGoldToPosition(gold: number): number {
    let posMin = 0
    let goldMin = 0

    for (const [posMax, goldMax] of SLIDER_TIERS) {
        if (gold <= goldMax) {
            const scale = (posMax - posMin) / (goldMax - goldMin)
            const pos = posMin + scale * (gold - goldMin)
            return pos
        }

        posMin = posMax
        goldMin = goldMax
    }

    throw new Error(`Invalid gold amount for conversion ${gold}`)
}
