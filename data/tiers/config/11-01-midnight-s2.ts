import type { ItemId } from '../../../src/common/api/BnetResponse.ts'
import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'Midnight Season 2 Raid BoE',
    slug: 't53' as Tier,
    iconName: '53-midnight-s2.webp',
    boes: [
        {
            label: 'Plate',
            ids: [
                271444,
                271445,
            ] as Array<ItemId>,
        },
        {
            label: 'Mail',
            ids: [
                271441,
                271440,
            ] as Array<ItemId>,
        },
        {
            label: 'Leather',
            ids: [
                271436,
                271438,
            ] as Array<ItemId>,
        },
        {
            label: 'Cloth',
            ids: [
                271434,
                271435,
            ] as Array<ItemId>,
        },
        {
            label: 'Jewelry',
            ids: [
                271638,
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
