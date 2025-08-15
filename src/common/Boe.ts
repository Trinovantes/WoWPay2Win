import { Brand } from '@/@types/Brand'

export type BoeGearLabel = 'Plate' | 'Mail' | 'Leather' | 'Cloth' | 'Weapon' | 'Back' | 'Jewelry' | 'Trinket' | 'Raid BoEs'
export type BoeProfessionLabel = 'Jewelcrafting' | 'Blacksmithing' | 'Leatherworking' | 'Tailoring' | 'Inscription' | 'Alchemy' | 'Enchanting' | 'Engineering' | 'Cooking'
export type BoeLabel = BoeGearLabel | BoeProfessionLabel

export type BoeCategory = Readonly<{
    label: BoeLabel
    ids: ReadonlyArray<number>
}>

export type BoeIlvlRange = Readonly<{
    min: number
    max: number
}>

export type Tier = Brand<string, 'Tier'>

export type TierConfig = Readonly<{
    name: string
    slug: Tier
    iconName: string
    boes: ReadonlyArray<BoeCategory>
    ilvlStep?: number
    ilvlRange?: BoeIlvlRange
    features?: Partial<{
        enableSecondaryFilter: boolean
    }>
}>

// Tier data is stored in from ./data/tiers/config and must be dynamically constructed into this Map
// For frontend, webpack can use require.context to generate this Map
// For backend, bunjs can use Glob to generate this Map
export type TierConfigMap = ReadonlyMap<Tier, TierConfig>

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

export function getAllBoeIds(tierConfigMap: TierConfigMap): Array<number> {
    return [...tierConfigMap.keys()].flatMap((tier) => getTierBoeIds(tierConfigMap, tier))
}

export function getTierBoeIds(tierConfigMap: TierConfigMap, tier: Tier): Array<number> {
    const tierConfig = tierConfigMap.get(tier)
    const boeIds = new Array<number>()

    for (const category of tierConfig?.boes ?? []) {
        for (const id of category.ids) {
            boeIds.push(id)
        }
    }

    return boeIds
}

export function getTierName(tierConfigMap: TierConfigMap, tier: Tier): string | undefined {
    return tierConfigMap.get(tier)?.name
}

export function getIlvlRange(tierConfigMap: TierConfigMap, tier: Tier): BoeIlvlRange {
    return {
        max: tierConfigMap.get(tier)?.ilvlRange?.max ?? 0,
        min: tierConfigMap.get(tier)?.ilvlRange?.min ?? 0,
    }
}
