import type { Tier, TierConfig } from '@/common/Boe'

const config: TierConfig = {
    name: "Ny'alotha, the Waking City",
    slug: 't24' as Tier,
    iconName: '24-nyalotha.png',
    boes: [
        {
            label: 'Raid BoEs',
            ids: [
                175004,
                175005,
                175010,
                175009,
                175008,
                175007,
                175006,
            ],
        },
    ],
    ilvlStep: 15,
    ilvlRange: {
        min: 85,
        max: 85 + (15 * 3),
    },
}

export default config
