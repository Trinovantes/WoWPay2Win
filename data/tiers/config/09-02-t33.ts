import type { Tier, TierConfig } from '@/common/Boe'

const config: TierConfig = {
    name: 'Aberrus, the Shadowed Crucible',
    slug: 't33' as Tier,
    iconName: '33-aberrus-the-shadowed-crucible.png',
    boes: [
        {
            label: 'Plate',
            ids: [
                204429,
                204430,
            ],
        },
        {
            label: 'Mail',
            ids: [
                204423,
                204422,
            ],
        },
        {
            label: 'Leather',
            ids: [
                204414,
                204415,
            ],
        },
        {
            label: 'Cloth',
            ids: [
                204410,
                204411,
            ],
        },
    ],
    ilvlStep: 13,
    ilvlRange: {
        min: 402,
        max: 402 + (13 * 3) + 9, // Later bosses drop up to base+9
    },
}

export default config
