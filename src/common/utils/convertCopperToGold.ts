export function convertCopperToGold(copperAmount: number): number {
    return Math.round(copperAmount / (100 * 100)) // 1 gold = 100 silver, 1 silver = 100 copper
}
