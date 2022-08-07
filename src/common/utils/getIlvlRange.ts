import { IlvlRange, Tier, TIER_CONFIGS } from '../TierConfig'

export function getIlvlRange(tier: Tier): IlvlRange {
    return Object.assign({}, TIER_CONFIGS[tier].ilvls)
}
