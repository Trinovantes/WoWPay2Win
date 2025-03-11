import type { Tier, TierConfig } from '@/common/Boe'

const config: TierConfig = {
    name: 'Sanctum of Domination',
    slug: 't28' as Tier,
    iconName: '28-sanctum-of-domination.png',
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
    ilvlStep: 13,
    ilvlRange: {
        min: 213,
        max: 213 + (13 * 3),
    },
}

export default config
