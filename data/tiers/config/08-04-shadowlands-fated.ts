import type { ItemId } from '../../../src/common/api/BnetResponse.ts'
import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'Shadowlands Fated Raids',
    slug: 'shadowlands-fated' as Tier,
    iconName: '0-shadowlands-fated.webp',
    boes: [
        {
            label: 'Cloth',
            ids: [
                190630,
                190631,
                186356,
                186358,
                183008,
                183017,
            ] as Array<ItemId>,
        },
        {
            label: 'Leather',
            ids: [
                190627,
                190626,
                186362,
                186359,
                183010,
                182978,
            ] as Array<ItemId>,
        },
        {
            label: 'Mail',
            ids: [
                190629,
                190628,
                186367,
                186364,
                182990,
                182982,
            ] as Array<ItemId>,
        },
        {
            label: 'Plate',
            ids: [
                190625,
                190624,
                186373,
                186371,
                183013,
                183031,
            ] as Array<ItemId>,
        },
        {
            label: 'Back',
            ids: [
                190334,
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
