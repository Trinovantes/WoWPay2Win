import type { ItemId } from '../../../src/common/api/BnetResponse.ts'
import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'Shadowlands World Drops',
    slug: 'shadowlands-world-drops' as Tier,
    iconName: '0-shadowlands.webp',
    boes: [
        {
            label: 'Trinket',
            ids: [
                184807,
            ] as Array<ItemId>,
        },
        {
            label: 'Jewelry',
            ids: [
                184785,
                184784,
                184783,
            ] as Array<ItemId>,
        },
        {
            label: 'Back',
            ids: [
                184782,
                184781,
            ] as Array<ItemId>,
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
            ] as Array<ItemId>,
        },
        {
            label: 'Cloth',
            ids: [
                184786,
                184787,
                184788,
            ] as Array<ItemId>,
        },
        {
            label: 'Leather',
            ids: [
                184790,
                184791,
                184789,
            ] as Array<ItemId>,
        },
        {
            label: 'Mail',
            ids: [
                184793,
                184794,
                184792,
            ] as Array<ItemId>,
        },
        {
            label: 'Plate',
            ids: [
                184795,
                184796,
                184808,
                184809,
            ] as Array<ItemId>,
        },
    ],
    features: {
        enableSocketFilter: true,
        enableTertiaryFilter: true,
    },
}

export default config
