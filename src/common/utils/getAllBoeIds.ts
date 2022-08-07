import { Tier, TIER_CONFIGS } from '../TierConfig'
import { getTierBoeIds } from './getTierBoeIds'

export function getAllBoeIds(): Array<number> {
    return Object.keys(TIER_CONFIGS).flatMap((tier) => getTierBoeIds(tier as Tier))
}
