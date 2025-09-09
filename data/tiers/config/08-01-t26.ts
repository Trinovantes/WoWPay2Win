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
            ],
        },
        {
            label: 'Leather',
            ids: [
                183010,
                182978,
            ],
        },
        {
            label: 'Mail',
            ids: [
                182990,
                182982,
            ],
        },
        {
            label: 'Plate',
            ids: [
                183013,
                183031,
            ],
        },
        {
            label: 'Back',
            ids: [
                184778,
            ],
        },
        {
            label: 'Jewelry',
            ids: [
                183035,
            ],
        },
    ],
    ilvlStep: 13,
    ilvlRange: {
        min: 187,
        max: 187 + (13 * 3),
    },
}

export default config
