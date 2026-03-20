import type { ItemId } from '../../../src/common/api/BnetResponse.ts'
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
            ] as Array<ItemId>,
        },
        {
            label: 'Mail',
            ids: [
                202005,
                202009,
            ] as Array<ItemId>,
        },
        {
            label: 'Leather',
            ids: [
                202004,
                202008,
            ] as Array<ItemId>,
        },
        {
            label: 'Cloth',
            ids: [
                202003,
                202007,
            ] as Array<ItemId>,
        },
        {
            label: 'Jewelry',
            ids: [
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
