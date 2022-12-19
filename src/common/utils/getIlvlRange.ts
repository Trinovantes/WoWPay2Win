import { IlvlRange, Tier, TIER_CONFIGS } from '../TierConfig'

export function getIlvlRange(tier: Tier): IlvlRange {
    return {
        max: TIER_CONFIGS[tier].ilvlRange.max,
        min: TIER_CONFIGS[tier].ilvlRange.min,
    }
}
