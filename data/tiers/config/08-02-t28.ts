import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'Sanctum of Domination',
    slug: 't28' as Tier,
    iconName: '28-sanctum-of-domination.webp',
    boes: [
        {
            label: 'Cloth',
            ids: [
                186356,
                186358,
            ],
        },
        {
            label: 'Leather',
            ids: [
                186362,
                186359,
            ],
        },
        {
            label: 'Mail',
            ids: [
                186367,
                186364,
            ],
        },
        {
            label: 'Plate',
            ids: [
                186373,
                186371,
            ],
        },
    ],
    features: {
        enableDifficultyFilter: true,
        enableSocketFilter: true,
        enableTertiaryFilter: true,
    },
}

export default config
