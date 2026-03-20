import type { ItemId } from '../../../src/common/api/BnetResponse.ts'
import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'Midnight Season 1 Raid BoE',
    slug: 't46' as Tier,
    iconName: '46-midnight-s1.webp',
    boes: [
        {
            label: 'Plate',
            ids: [
                260376,
                260377,
            ] as Array<ItemId>,
        },
        {
            label: 'Mail',
            ids: [
                260374,
                260375,
            ] as Array<ItemId>,
        },
        {
            label: 'Leather',
            ids: [
                260372,
                260373,
            ] as Array<ItemId>,
        },
        {
            label: 'Cloth',
            ids: [
                260370,
                260371,
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
