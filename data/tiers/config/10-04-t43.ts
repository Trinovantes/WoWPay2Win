import type { Tier, TierConfig } from '@/common/Boe'

const config: TierConfig = {
    name: 'Manaforge Omega',
    slug: 't43' as Tier,
    iconName: '43-manaforge-omega.webp',
    boes: [
        {
            label: 'Plate',
            ids: [
                238028,
                238034,
            ],
        },
        {
            label: 'Mail',
            ids: [
                238032,
                238030,
            ],
        },
        {
            label: 'Leather',
            ids: [
                238031,
                238027,
            ],
        },
        {
            label: 'Cloth',
            ids: [
                238033,
                243048,
            ],
        },
        {
            label: 'Jewelry',
            ids: [
                238036,
            ],
        },
    ],
    ilvlStep: 13,
    ilvlRange: {
        min: 671,
        max: 671 + (13 * 4),
    },
}

export default config
