import type { ItemId } from '../../../src/common/api/BnetResponse.ts'
import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'War Within Profession Recipes',
    slug: 'war-within-professions' as Tier,
    iconName: '0-war-within.webp',
    boes: [
        {
            label: 'Jewelcrafting',
            ids: [
                228320,
            ] as Array<ItemId>,
        },
        {
            label: 'Blacksmithing',
            ids: [
                223040,
                223043,
                223048,
                226643,
            ] as Array<ItemId>,
        },
        {
            label: 'Leatherworking',
            ids: [
                223095,
                223097,
                223098,
                223099,
                223102,
            ] as Array<ItemId>,
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
            ] as Array<ItemId>,
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
            ] as Array<ItemId>,
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
            ] as Array<ItemId>,
        },
        {
            label: 'Cooking',
            ids: [
                227281,
                227283,
            ] as Array<ItemId>,
        },
    ],
}

export default config
