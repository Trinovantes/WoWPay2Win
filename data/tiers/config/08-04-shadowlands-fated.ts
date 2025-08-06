import type { Tier, TierConfig } from '@/common/Boe'

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
            ],
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
            ],
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
            ],
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
            ],
        },
        {
            label: 'Back',
            ids: [
                190334,
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
        min: 265,
        max: 265 + (13 * 3),
    },
}

export default config
