import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'Vault of the Incarnates',
    slug: 't31' as Tier,
    iconName: '31-vault-of-the-incarnates.webp',
    boes: [
        {
            label: 'Plate',
            ids: [
                202006,
                202010,
            ],
        },
        {
            label: 'Mail',
            ids: [
                202005,
                202009,
            ],
        },
        {
            label: 'Leather',
            ids: [
                202004,
                202008,
            ],
        },
        {
            label: 'Cloth',
            ids: [
                202003,
                202007,
            ],
        },
        {
            label: 'Jewelry',
            ids: [
                201992,
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
