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

export type Tier = Brand<string, 'Brand'>

export type TierConfig = Readonly<{
    name: string
    slug: Tier
    iconName: string
    boes: ReadonlyArray<BoeCategory>
    ilvlStep?: number
    ilvlRange?: BoeIlvlRange
}>

// ----------------------------------------------------------------------------
// Tier Data
// ----------------------------------------------------------------------------

/*
Use this script to quickly extract item ids from wowhead item search
https://www.wowhead.com/items/quality:4?filter=3:82:161:128;1:2:1:4;0:110002:0:0 (for raid boe)
https://www.wowhead.com/items/name:Design/quality:3:4?filter=99:166:92;11:11:2;0:0:0#0-14+19 (for profession)

$('table.listview-mode-default').find('td:nth-child(3)').find('a.q4, a.q3').each((idx, el) => {
    const href = $(el).attr('href')
    const id = /(\d+)/.exec(href)[0]
    console.info(`${id}, // ${href}`)
})
*/

export const { tierConfigs, defaultTier } = (() => {
    const tierConfigsImportCtx = require.context('./tiers', true, /\d{2}-\d{2}-[\w-]+\.ts$/) // Webpack specific function
    const tierConfigsArr = new Array<TierConfig>()
    for (const fileName of tierConfigsImportCtx.keys()) {
        const configFile = tierConfigsImportCtx(fileName) as { default: TierConfig }
        tierConfigsArr.push(configFile.default)
    }

    const tierConfigs: ReadonlyMap<Tier, TierConfig> = new Map(tierConfigsArr.toReversed().map((config) => [config.slug, config]))
    const defaultTier = tierConfigsArr[tierConfigsArr.length - 1].slug

    return {
        tierConfigs,
        defaultTier,
    }
})()

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

export function getAllBoeIds(): Array<number> {
    return [...tierConfigs.keys()].flatMap((tier) => getTierBoeIds(tier))
}

export function getTierBoeIds(tier: Tier): Array<number> {
    const tierConfig = tierConfigs.get(tier)
    const boeIds = new Array<number>()

    for (const category of tierConfig?.boes ?? []) {
        for (const id of category.ids) {
            boeIds.push(id)
        }
    }

    return boeIds
}

export function getTierName(tier: Tier): string | undefined {
    return tierConfigs.get(tier)?.name
}

export function getIlvlRange(tier: Tier): BoeIlvlRange {
    return {
        max: tierConfigs.get(tier)?.ilvlRange?.max ?? 0,
        min: tierConfigs.get(tier)?.ilvlRange?.min ?? 0,
    }
}
