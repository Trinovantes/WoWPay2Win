import type { Tier, TierConfig } from '@/common/Boe'

const config: TierConfig = {
    name: 'Dragonflight Awakened Raids',
    slug: 'dragonflight-awakened' as Tier,
    iconName: '0-dragonflight-awakened.webp',
    boes: [
        {
            label: 'Plate',
            ids: [
                208426,
                208427,
                204429,
                204430,
                202006,
                202010,
            ],
        },
        {
            label: 'Mail',
            ids: [
                208428,
                208434,
                204423,
                204422,
                202005,
                202009,
            ],
        },
        {
            label: 'Leather',
            ids: [
                208420,
                208432,
                204414,
                204415,
                202004,
                202008,
            ],
        },
        {
            label: 'Cloth',
            ids: [
                208431,
                208430,
                204410,
                204411,
                202003,
                202007,
            ],
        },
        {
            label: 'Jewelry',
            ids: [
                208442,
                201992,
            ],
        },
    ],
    ilvlStep: 13,
    ilvlRange: {
        min: 480,
        max: 480 + (13 * 3) + 9, // Later bosses drop up to base+9
    },
}

export default config
