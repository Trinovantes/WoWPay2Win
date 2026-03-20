import type { ItemId } from '../../../src/common/api/BnetResponse.ts'
import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'Manaforge Omega',
    slug: 't43' as Tier,
    iconName: '43-manaforge-omega.webp',
    boes: [
        {
            label: 'Plate',
            ids: [
                238028,
                238034,
            ] as Array<ItemId>,
        },
        {
            label: 'Mail',
            ids: [
                238032,
                238030,
            ] as Array<ItemId>,
        },
        {
            label: 'Leather',
            ids: [
                238031,
                238027,
            ] as Array<ItemId>,
        },
        {
            label: 'Cloth',
            ids: [
                238033,
                243048,
            ] as Array<ItemId>,
        },
        {
            label: 'Jewelry',
            ids: [
                238036,
            ] as Array<ItemId>,
        },
    ],
    features: {
        enableDifficultyFilter: true,
        enableSocketFilter: true,
        enableTertiaryFilter: true,
        enableSecondaryFilter: true,
    },
}

export default config
