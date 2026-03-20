import type { ItemId } from '../../../src/common/api/BnetResponse.ts'
import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'Aberrus, the Shadowed Crucible',
    slug: 't33' as Tier,
    iconName: '33-aberrus-the-shadowed-crucible.webp',
    boes: [
        {
            label: 'Plate',
            ids: [
                204429,
                204430,
            ] as Array<ItemId>,
        },
        {
            label: 'Mail',
            ids: [
                204423,
                204422,
            ] as Array<ItemId>,
        },
        {
            label: 'Leather',
            ids: [
                204414,
                204415,
            ] as Array<ItemId>,
        },
        {
            label: 'Cloth',
            ids: [
                204410,
                204411,
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
