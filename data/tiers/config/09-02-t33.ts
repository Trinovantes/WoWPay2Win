import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'Aberrus, the Shadowed Crucible',
    slug: 't33' as Tier,
    iconName: '33-aberrus-the-shadowed-crucible.webp',
    boes: [
        {
            label: 'Plate',
            ids: [
                204429,
                204430,
            ],
        },
        {
            label: 'Mail',
            ids: [
                204423,
                204422,
            ],
        },
        {
            label: 'Leather',
            ids: [
                204414,
                204415,
            ],
        },
        {
            label: 'Cloth',
            ids: [
                204410,
                204411,
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
