import type { ItemId } from '../../../src/common/api/BnetResponse.ts'
import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: "Amirdrassil, the Dream's Hope",
    slug: 't35' as Tier,
    iconName: '35-amirdrassil-the-dreams-hope.webp',
    boes: [
        {
            label: 'Plate',
            ids: [
                208426,
                208427,
            ] as Array<ItemId>,
        },
        {
            label: 'Mail',
            ids: [
                208428,
                208434,
            ] as Array<ItemId>,
        },
        {
            label: 'Leather',
            ids: [
                208420,
                208432,
            ] as Array<ItemId>,
        },
        {
            label: 'Cloth',
            ids: [
                208431,
                208430,
            ] as Array<ItemId>,
        },
        {
            label: 'Jewelry',
            ids: [
                208442,
            ] as Array<ItemId>,
        },
    ],
    features: {
        enableDifficultyFilter: true,
        enableSocketFilter: true,
        enableTertiaryFilter: true,
    },
}

export default config
