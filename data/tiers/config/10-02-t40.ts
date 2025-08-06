import type { Tier, TierConfig } from '@/common/Boe'

const config: TierConfig = {
    name: 'Blackrock Depths (20th Anniversary)',
    slug: 't40' as Tier,
    iconName: '40-blackrock-depths.webp',
    boes: [
        {
            label: 'Plate',
            ids: [
                231507, // https://www.wowhead.com/item=231507/battlechasers-greaves
                231504, // https://www.wowhead.com/item=231504/runed-golem-shackles
            ],
        },
        {
            label: 'Mail',
            ids: [
                231503, // https://www.wowhead.com/item=231503/braincage
            ],
        },
        {
            label: 'Leather',
            ids: [
                231502, // https://www.wowhead.com/item=231502/mar-aloms-grip
            ],
        },
        {
            label: 'Cloth',
            ids: [
                231500, // https://www.wowhead.com/item=231500/funeral-pyre-vestment
                231501, // https://www.wowhead.com/item=231501/aristocratic-cuffs
            ],
        },
        {
            label: 'Back',
            ids: [
                231506, // https://www.wowhead.com/item=231506/blisterbane-wrap
                231505, // https://www.wowhead.com/item=231505/stoneshield-cloak
            ],
        },
        {
            label: 'Weapon',
            ids: [
                231496, // https://www.wowhead.com/item=231496/the-judges-gavel
                231498, // https://www.wowhead.com/item=231498/spire-of-the-stoneshaper
                231499, // https://www.wowhead.com/item=231499/doomforged-straightedge
                231495, // https://www.wowhead.com/item=231495/ribsplitter
                231497, // https://www.wowhead.com/item=231497/searing-needle
            ],
        },
    ],
    ilvlStep: 13,
    ilvlRange: {
        min: 584,
        max: 584 + (13 * 2),
    },
}

export default config
