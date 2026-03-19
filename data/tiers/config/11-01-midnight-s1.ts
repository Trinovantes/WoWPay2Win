import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'Midnight Season 1 Raid BoE',
    slug: 't46' as Tier,
    iconName: '46-midnight-s1.webp',
    boes: [
        {
            label: 'Plate',
            ids: [
                260376,
                260377,
            ],
        },
        {
            label: 'Mail',
            ids: [
                260374,
                260375,
            ],
        },
        {
            label: 'Leather',
            ids: [
                260372,
                260373,
            ],
        },
        {
            label: 'Cloth',
            ids: [
                260370,
                260371,
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
