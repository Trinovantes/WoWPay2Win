import type { Tier, TierConfig } from '../Boe'

const config: TierConfig = {
    name: 'Shadowlands World Drops',
    slug: 'shadowlands-world-drops' as Tier,
    iconName: '0-shadowlands.png',
    boes: [
        {
            label: 'Trinket',
            ids: [
                184807,
            ],
        },
        {
            label: 'Jewelry',
            ids: [
                184785,
                184784,
                184783,
            ],
        },
        {
            label: 'Back',
            ids: [
                184782,
                184781,
            ],
        },
        {
            label: 'Weapon',
            ids: [
                184805,
                184798,
                184797,
                184799,
                184800,
                184801,
                184803,
                184806,
                184804,
                184802,
                181393,
            ],
        },
        {
            label: 'Cloth',
            ids: [
                184786,
                184787,
                184788,
            ],
        },
        {
            label: 'Leather',
            ids: [
                184790,
                184791,
                184789,
            ],
        },
        {
            label: 'Mail',
            ids: [
                184793,
                184794,
                184792,
            ],
        },
        {
            label: 'Plate',
            ids: [
                184795,
                184796,
                184808,
                184809,
            ],
        },
    ],
    ilvlStep: 1,
    ilvlRange: {
        min: 190,
        max: 207,
    },
}

export default config
