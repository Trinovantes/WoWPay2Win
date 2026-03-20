import type { ItemId } from '../../../src/common/api/BnetResponse.ts'
import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'Nerub-ar Palace',
    slug: 't38' as Tier,
    iconName: '38-nerub-ar-palace.webp',
    boes: [
        {
            label: 'Plate',
            ids: [
                225727,
                225744,
            ] as Array<ItemId>,
        },
        {
            label: 'Mail',
            ids: [
                225724,
                225725,
            ] as Array<ItemId>,
        },
        {
            label: 'Leather',
            ids: [
                225722,
                225723,
            ] as Array<ItemId>,
        },
        {
            label: 'Cloth',
            ids: [
                225720,
                225721,
            ] as Array<ItemId>,
        },
        {
            label: 'Jewelry',
            ids: [
                225728,
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
