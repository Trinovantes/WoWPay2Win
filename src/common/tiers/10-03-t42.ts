import type { Tier, TierConfig } from '../Boe'

const config: TierConfig = {
    name: 'Liberation of Undermine',
    slug: 't42' as Tier,
    iconName: '42-liberation-of-undermine.png',
    boes: [
        {
            label: 'Plate',
            ids: [
                232661,
                232662,
            ],
        },
        {
            label: 'Mail',
            ids: [
                232659,
                232660,
            ],
        },
        {
            label: 'Leather',
            ids: [
                232657,
                232658,
            ],
        },
        {
            label: 'Cloth',
            ids: [
                232655,
                232656,
            ],
        },
        {
            label: 'Jewelry',
            ids: [
                232663,
            ],
        },
    ],
    ilvlStep: 13,
    ilvlRange: {
        min: 623,
        max: 623 + (13 * 3),
    },
}

export default config
