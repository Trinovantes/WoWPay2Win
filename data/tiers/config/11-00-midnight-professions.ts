import type { Tier, TierConfig } from '../../../src/common/Boe.ts'

const config: TierConfig = {
    name: 'Midnight Season 1 Raid Recipes',
    slug: 'midnight-s1-professions' as Tier,
    iconName: '46-midnight-s1.webp',
    boes: [
        {
            label: 'Blacksmithing',
            ids: [
                258522,
                258521,
                258517,
                258519,
            ],
        },
        {
            label: 'Leatherworking',
            ids: [
                256656,
            ],
        },
        {
            label: 'Tailoring',
            ids: [
                258123,
            ],
        },
        {
            label: 'Enchanting',
            ids: [
                256750,
            ],
        },
    ],
}

export default config
