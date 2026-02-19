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
            ],
        },
        {
            label: 'Mail',
            ids: [
                238032,
                238030,
            ],
        },
        {
            label: 'Leather',
            ids: [
                238031,
                238027,
            ],
        },
        {
            label: 'Cloth',
            ids: [
                238033,
                243048,
            ],
        },
        {
            label: 'Jewelry',
            ids: [
                238036,
            ],
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
