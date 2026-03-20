import type { ItemId } from '../../../src/common/api/BnetResponse.ts'
import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'Castle Nathria',
    slug: 't26' as Tier,
    iconName: '26-castle-nathria.webp',
    boes: [
        {
            label: 'Cloth',
            ids: [
                183008,
                183017,
            ] as Array<ItemId>,
        },
        {
            label: 'Leather',
            ids: [
                183010,
                182978,
            ] as Array<ItemId>,
        },
        {
            label: 'Mail',
            ids: [
                182990,
                182982,
            ] as Array<ItemId>,
        },
        {
            label: 'Plate',
            ids: [
                183013,
                183031,
            ] as Array<ItemId>,
        },
        {
            label: 'Back',
            ids: [
                184778,
            ] as Array<ItemId>,
        },
        {
            label: 'Jewelry',
            ids: [
                183035,
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
