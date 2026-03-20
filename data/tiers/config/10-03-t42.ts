import type { ItemId } from '../../../src/common/api/BnetResponse.ts'
import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'Liberation of Undermine',
    slug: 't42' as Tier,
    iconName: '42-liberation-of-undermine.webp',
    boes: [
        {
            label: 'Plate',
            ids: [
                232661,
                232662,
            ] as Array<ItemId>,
        },
        {
            label: 'Mail',
            ids: [
                232659,
                232660,
            ] as Array<ItemId>,
        },
        {
            label: 'Leather',
            ids: [
                232657,
                232658,
            ] as Array<ItemId>,
        },
        {
            label: 'Cloth',
            ids: [
                232655,
                232656,
            ] as Array<ItemId>,
        },
        {
            label: 'Jewelry',
            ids: [
                232663,
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
