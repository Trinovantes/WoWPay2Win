import type { Tier, TierConfig } from '@/common/Boe'

const config: TierConfig = {
    name: 'Nerub-ar Palace',
    slug: 't38' as Tier,
    iconName: '38-nerub-ar-palace.webp',
    boes: [
        {
            label: 'Plate',
            ids: [
                225727,
                225744,
            ],
        },
        {
            label: 'Mail',
            ids: [
                225724,
                225725,
            ],
        },
        {
            label: 'Leather',
            ids: [
                225722,
                225723,
            ],
        },
        {
            label: 'Cloth',
            ids: [
                225720,
                225721,
            ],
        },
        {
            label: 'Jewelry',
            ids: [
                225728,
            ],
        },
    ],
    ilvlStep: 13,
    ilvlRange: {
        min: 590,
        max: 590 + (13 * 4),
    },
}

export default config
