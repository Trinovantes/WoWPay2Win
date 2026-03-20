import type { ItemId } from '../../../src/common/api/BnetResponse.ts'
import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'Dragonflight Awakened Raids',
    slug: 'dragonflight-awakened' as Tier,
    iconName: '0-dragonflight-awakened.webp',
    boes: [
        {
            label: 'Plate',
            ids: [
                208426,
                208427,
                204429,
                204430,
                202006,
                202010,
            ] as Array<ItemId>,
        },
        {
            label: 'Mail',
            ids: [
                208428,
                208434,
                204423,
                204422,
                202005,
                202009,
            ] as Array<ItemId>,
        },
        {
            label: 'Leather',
            ids: [
                208420,
                208432,
                204414,
                204415,
                202004,
                202008,
            ] as Array<ItemId>,
        },
        {
            label: 'Cloth',
            ids: [
                208431,
                208430,
                204410,
                204411,
                202003,
                202007,
            ] as Array<ItemId>,
        },
        {
            label: 'Jewelry',
            ids: [
                208442,
                201992,
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
