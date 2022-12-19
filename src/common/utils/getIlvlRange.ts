import { IlvlRange, Tier, TIER_CONFIGS } from '../TierConfig'

export function getIlvlRange(tier: Tier): IlvlRange {
    return {
        max: TIER_CONFIGS[tier].ilvls.max,
        min: TIER_CONFIGS[tier].ilvls.min,
    }
}
