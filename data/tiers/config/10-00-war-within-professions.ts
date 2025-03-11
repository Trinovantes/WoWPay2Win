import type { Tier, TierConfig } from '@/common/Boe'

const config: TierConfig = {
    name: 'War Within Profession Recipes',
    slug: 'war-within-professions' as Tier,
    iconName: '0-war-within.png',
    boes: [
        {
            label: 'Jewelcrafting',
            ids: [
                228320,
            ],
        },
        {
            label: 'Blacksmithing',
            ids: [
                223040,
                223043,
                223048,
                226643,
            ],
        },
        {
            label: 'Leatherworking',
            ids: [
                223095,
                223097,
                223098,
                223099,
                223102,
            ],
        },
        {
            label: 'Tailoring',
            ids: [
                224424,
                224426,
                224434,
                224435,
                224436,
                224437,
            ],
        },
        {
            label: 'Enchanting',
            ids: [
                223115,
                223116,
                223117,
                223118,
                223119,
                223120,
                223126,
                223134,
                223135,
                223138,
                223139,
                223140,
                223141,
                223142,
                223143,
                223144,
                228708,
            ],
        },
        {
            label: 'Inscription',
            ids: [
                225475,
                225476,
                225477,
                225480,
                225481,
                225484,
            ],
        },
        {
            label: 'Cooking',
            ids: [
                227281,
                227283,
            ],
        },
    ],
}

export default config
