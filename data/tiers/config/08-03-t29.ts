import type { ItemId } from '../../../src/common/api/BnetResponse.ts'
import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'Sepulcher of the First Ones',
    slug: 't29' as Tier,
    iconName: '29-sepulcher-of-the-first-ones.webp',
    boes: [
        {
            label: 'Cloth',
            ids: [
                190630,
                190631,
            ] as Array<ItemId>,
        },
        {
            label: 'Leather',
            ids: [
                190627,
                190626,
            ] as Array<ItemId>,
        },
        {
            label: 'Mail',
            ids: [
                190629,
                190628,
            ] as Array<ItemId>,
        },
        {
            label: 'Plate',
            ids: [
                190625,
                190624,
            ] as Array<ItemId>,
        },
        {
            label: 'Back',
            ids: [
                190334,
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
