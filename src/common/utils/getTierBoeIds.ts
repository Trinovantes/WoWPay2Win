import { Tier, TIER_CONFIGS } from '../Constants'

export function getTierBoeIds(tier: Tier): Array<number> {
    const tierConfig = TIER_CONFIGS[tier]
    const boeIds: Array<number> = []

    for (const category of tierConfig.boes) {
        for (const id of category.ids) {
            boeIds.push(id)
        }
    }

    return boeIds
}
