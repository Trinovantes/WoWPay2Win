import { IlvlRange, Tier, TIER_CONFIGS } from '../TierConfig'

export function getIlvlRange(tier: Tier): IlvlRange {
    return {
        max: TIER_CONFIGS[tier].ilvlRange?.max ?? 0,
        min: TIER_CONFIGS[tier].ilvlRange?.min ?? 0,
    }
}
