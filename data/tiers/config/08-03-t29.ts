import type { Tier, TierConfig } from '@/common/Boe'

const config: TierConfig = {
    name: 'Sepulcher of the First Ones',
    slug: 't29' as Tier,
    iconName: '29-sepulcher-of-the-first-ones.png',
    boes: [
        {
            label: 'Cloth',
            ids: [
                190630,
                190631,
            ],
        },
        {
            label: 'Leather',
            ids: [
                190627,
                190626,
            ],
        },
        {
            label: 'Mail',
            ids: [
                190629,
                190628,
            ],
        },
        {
            label: 'Plate',
            ids: [
                190625,
                190624,
            ],
        },
        {
            label: 'Back',
            ids: [
                190334,
            ],
        },
    ],
    ilvlStep: 13,
    ilvlRange: {
        min: 239,
        max: 239 + (13 * 3),
    },
}

export default config
