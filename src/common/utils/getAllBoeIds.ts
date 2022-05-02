import { TIER_CONFIGS, type Tier } from '../Constants'
import { getTierBoeIds } from './getTierBoeIds'

export function getAllBoeIds(): Array<number> {
    const boeIds: Array<number> = []

    for (const tier of Object.keys(TIER_CONFIGS)) {
        boeIds.push(...getTierBoeIds(tier as Tier))
    }

    return boeIds
}
