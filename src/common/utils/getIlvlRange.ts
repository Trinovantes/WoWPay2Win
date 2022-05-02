import { type Tier, type IlvlRange, TIER_CONFIGS } from '../Constants'

export function getIlvlRange(tier: Tier): IlvlRange {
    return Object.assign({}, TIER_CONFIGS[tier].ilvls)
}
