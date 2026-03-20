import type { ItemId } from '../../../src/common/api/BnetResponse.ts'
import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'Sanctum of Domination',
    slug: 't28' as Tier,
    iconName: '28-sanctum-of-domination.webp',
    boes: [
        {
            label: 'Cloth',
            ids: [
                186356,
                186358,
            ] as Array<ItemId>,
        },
        {
            label: 'Leather',
            ids: [
                186362,
                186359,
            ] as Array<ItemId>,
        },
        {
            label: 'Mail',
            ids: [
                186367,
                186364,
            ] as Array<ItemId>,
        },
        {
            label: 'Plate',
            ids: [
                186373,
                186371,
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
