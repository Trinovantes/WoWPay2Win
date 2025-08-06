import type { Tier, TierConfig } from '@/common/Boe'

const config: TierConfig = {
    name: "Amirdrassil, the Dream's Hope",
    slug: 't35' as Tier,
    iconName: '35-amirdrassil-the-dreams-hope.webp',
    boes: [
        {
            label: 'Plate',
            ids: [
                208426,
                208427,
            ],
        },
        {
            label: 'Mail',
            ids: [
                208428,
                208434,
            ],
        },
        {
            label: 'Leather',
            ids: [
                208420,
                208432,
            ],
        },
        {
            label: 'Cloth',
            ids: [
                208431,
                208430,
            ],
        },
        {
            label: 'Jewelry',
            ids: [
                208442,
            ],
        },
    ],
    ilvlStep: 13,
    ilvlRange: {
        min: 441,
        max: 441 + (13 * 3) + 9, // Later bosses drop up to base+9
    },
}

export default config
