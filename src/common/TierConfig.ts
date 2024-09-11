/*
Use this script to quickly extract item ids from wowhead item search
https://www.wowhead.com/items/quality:4?filter=3:82:161:128;1:2:1:4;0:110002:0:0 (for raid boe)
https://www.wowhead.com/items/name:Design/quality:3:4?filter=99:166:92;11:11:2;0:0:0#0-14+19 (for profession)

$('table.listview-mode-default').find('td:nth-child(3)').find('a.q4, a.q3').each((idx, el) => {
    const href = $(el).attr('href')
    const id = /(\d+)/.exec(href)[0]
    console.info(id, href)
})
*/

// Tier ids should match warcraftlogs.com
export enum Tier {
    // BfA
    Nyalotha = 't24',

    // Shadowlands
    Shadowlands = 'shadowlands',
    CastleNathria = 't26',
    SanctumOfDomination = 't28',
    SepulcherOfTheFirstOnes = 't29',
    ShadowlandsFatedRaids = 'shadowlands-fated',

    // Dragonflight
    DragonflightProfessions = 'dragonflight-professions',
    VaultOfTheIncarnates = 't31',
    AberrusTheShadowedCrucible = 't33',
    AmirdrassilTheDreamsHope = 't35',
    DragonflightAwakened = 'dragonflight-awakened',

    // War Within
    WarWithinProfessions = 'war-within-professions',
    NerubArPalace = 'nerub-ar-palace',
}

// IMPORTANT: Update every tier
export const DEFAULT_TIER = Tier.NerubArPalace

export type BoeGearLabel = 'Plate' | 'Mail' | 'Leather' | 'Cloth' | 'Weapon' | 'Back' | 'Jewelry' | 'Trinket' | 'Raid BoEs'
export type BoeProfessionLabel = 'Jewelcrafting' | 'Blacksmithing' | 'Leatherworking' | 'Tailoring' | 'Inscription' | 'Alchemy' | 'Enchanting' | 'Engineering' | 'Cooking'
export type BoeLabel = BoeGearLabel | BoeProfessionLabel

export type BoeCategory = {
    label: BoeLabel
    ids: ReadonlyArray<number>
}

export type IlvlRange = {
    min: number
    max: number
}

export type TierConfig = Readonly<{
    name: string
    iconPath: string
    boes: ReadonlyArray<Readonly<BoeCategory>>
    ilvlStep?: number
    ilvlRange?: Readonly<IlvlRange>
}>

export const TIER_CONFIGS: Readonly<Record<Tier, TierConfig>> = {
    [Tier.NerubArPalace]: {
        name: 'Nerub-ar Palace',
        iconPath: '38-nerub-ar-palace.png',
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
            max: 590 + (13 * 3) + 9, // Later bosses drop up to base+9
        },
    },
    [Tier.WarWithinProfessions]: {
        name: 'War Within Profession Recipes',
        iconPath: '0-war-within.png',
        boes: [
            {
                label: 'Jewelcrafting',
                ids: [
                    228320,
                ],
            },
            {
                label: 'Blacksmithing',
                ids: [
                    223040,
                    223043,
                    223048,
                    226643,
                ],
            },
            {
                label: 'Leatherworking',
                ids: [
                    223095,
                    223097,
                    223098,
                    223099,
                    223102,
                ],
            },
            {
                label: 'Tailoring',
                ids: [
                    224424,
                    224426,
                    224434,
                    224435,
                    224436,
                    224437,
                ],
            },
            {
                label: 'Enchanting',
                ids: [
                    223115,
                    223116,
                    223117,
                    223118,
                    223119,
                    223120,
                    223126,
                    223134,
                    223135,
                    223138,
                    223139,
                    223140,
                    223141,
                    223142,
                    223143,
                    223144,
                    228708,
                ],
            },
            {
                label: 'Inscription',
                ids: [
                    225475,
                    225476,
                    225477,
                    225480,
                    225481,
                    225484,
                ],
            },
            {
                label: 'Cooking',
                ids: [
                    227281,
                    227283,
                ],
            },
        ],
    },
    [Tier.DragonflightAwakened]: {
        name: 'Dragonflight Awakened Raids',
        iconPath: '0-dragonflight-awakened.jpg',
        boes: [
            {
                label: 'Plate',
                ids: [
                    208426,
                    208427,
                    204429,
                    204430,
                    202006,
                    202010,
                ],
            },
            {
                label: 'Mail',
                ids: [
                    208428,
                    208434,
                    204423,
                    204422,
                    202005,
                    202009,
                ],
            },
            {
                label: 'Leather',
                ids: [
                    208420,
                    208432,
                    204414,
                    204415,
                    202004,
                    202008,
                ],
            },
            {
                label: 'Cloth',
                ids: [
                    208431,
                    208430,
                    204410,
                    204411,
                    202003,
                    202007,
                ],
            },
            {
                label: 'Jewelry',
                ids: [
                    208442,
                    201992,
                ],
            },
        ],
        ilvlStep: 13,
        ilvlRange: {
            min: 480,
            max: 480 + (13 * 3) + 9, // Later bosses drop up to base+9
        },
    },
    [Tier.AmirdrassilTheDreamsHope]: {
        name: "Amirdrassil, the Dream's Hope",
        iconPath: '35-amirdrassil-the-dreams-hope.png',
        boes: [
            {
                label: 'Plate',
                ids: [
                    208426,
                    208427,
                ],
            },
            {
                label: 'Mail',
                ids: [
                    208428,
                    208434,
                ],
            },
            {
                label: 'Leather',
                ids: [
                    208420,
                    208432,
                ],
            },
            {
                label: 'Cloth',
                ids: [
                    208431,
                    208430,
                ],
            },
            {
                label: 'Jewelry',
                ids: [
                    208442,
                ],
            },
        ],
        ilvlStep: 13,
        ilvlRange: {
            min: 441,
            max: 441 + (13 * 3) + 9, // Later bosses drop up to base+9
        },
    },
    [Tier.AberrusTheShadowedCrucible]: {
        name: 'Aberrus, the Shadowed Crucible',
        iconPath: '33-aberrus-the-shadowed-crucible.png',
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
    },
    [Tier.VaultOfTheIncarnates]: {
        name: 'Vault of the Incarnates',
        iconPath: '31-vault-of-the-incarnates.png',
        boes: [
            {
                label: 'Plate',
                ids: [
                    202006,
                    202010,
                ],
            },
            {
                label: 'Mail',
                ids: [
                    202005,
                    202009,
                ],
            },
            {
                label: 'Leather',
                ids: [
                    202004,
                    202008,
                ],
            },
            {
                label: 'Cloth',
                ids: [
                    202003,
                    202007,
                ],
            },
            {
                label: 'Jewelry',
                ids: [
                    201992,
                ],
            },
        ],
        ilvlStep: 13,
        ilvlRange: {
            min: 376,
            max: 376 + (13 * 3) + 9, // Later bosses drop up to base+9
        },
    },
    [Tier.DragonflightProfessions]: {
        name: 'Dragonflight Profession Recipes',
        iconPath: '0-dragonflight.png',
        boes: [
            {
                label: 'Jewelcrafting',
                ids: [
                    194640,
                    194641,
                    194642,
                ],
            },
            {
                label: 'Blacksmithing',
                ids: [
                    205145,
                    205144,

                    194484,
                    194485,
                    194492,
                    194491,
                    194490,
                    194489,
                    194486,

                    194483,
                    194476,
                    194481,
                ],
            },
            {
                label: 'Leatherworking',
                ids: [
                    204968,

                    193880,
                    193881,
                    193882,
                    193883,

                    193873,
                    193872,
                    193868,
                    193869,
                ],
            },
            {
                label: 'Tailoring',
                ids: [
                    205140,
                    194255,
                    194260,
                    194259,
                    194256,
                ],
            },
            {
                label: 'Inscription',
                ids: [
                    198876,
                ],
            },
            {
                label: 'Alchemy',
                ids: [
                    204696,
                    204695,
                    201740,
                    191544,
                    191597,
                ],
            },
            {
                label: 'Enchanting',
                ids: [
                    204975,
                ],
            },
            {
                label: 'Engineering',
                ids: [
                    199227,
                    205036,
                ],
            },
        ],
    },
    [Tier.ShadowlandsFatedRaids]: {
        name: 'Shadowlands Fated Raids',
        iconPath: '0-shadowlands-fated.jpg',
        boes: [
            {
                label: 'Cloth',
                ids: [
                    190630,
                    190631,
                    186356,
                    186358,
                    183008,
                    183017,
                ],
            },
            {
                label: 'Leather',
                ids: [
                    190627,
                    190626,
                    186362,
                    186359,
                    183010,
                    182978,
                ],
            },
            {
                label: 'Mail',
                ids: [
                    190629,
                    190628,
                    186367,
                    186364,
                    182990,
                    182982,
                ],
            },
            {
                label: 'Plate',
                ids: [
                    190625,
                    190624,
                    186373,
                    186371,
                    183013,
                    183031,
                ],
            },
            {
                label: 'Back',
                ids: [
                    190334,
                    184778,
                ],
            },
            {
                label: 'Jewelry',
                ids: [
                    183035,
                ],
            },
        ],
        ilvlStep: 13,
        ilvlRange: {
            min: 265,
            max: 265 + (13 * 3),
        },
    },
    [Tier.SepulcherOfTheFirstOnes]: {
        name: 'Sepulcher of the First Ones',
        iconPath: '29-sepulcher-of-the-first-ones.png',
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
    },
    [Tier.SanctumOfDomination]: {
        name: 'Sanctum of Domination',
        iconPath: '28-sanctum-of-domination.png',
        boes: [
            {
                label: 'Cloth',
                ids: [
                    186356,
                    186358,
                ],
            },
            {
                label: 'Leather',
                ids: [
                    186362,
                    186359,
                ],
            },
            {
                label: 'Mail',
                ids: [
                    186367,
                    186364,
                ],
            },
            {
                label: 'Plate',
                ids: [
                    186373,
                    186371,
                ],
            },
        ],
        ilvlStep: 13,
        ilvlRange: {
            min: 213,
            max: 213 + (13 * 3),
        },
    },
    [Tier.CastleNathria]: {
        name: 'Castle Nathria',
        iconPath: '26-castle-nathria.png',
        boes: [
            {
                label: 'Cloth',
                ids: [
                    183008,
                    183017,
                ],
            },
            {
                label: 'Leather',
                ids: [
                    183010,
                    182978,
                ],
            },
            {
                label: 'Mail',
                ids: [
                    182990,
                    182982,
                ],
            },
            {
                label: 'Plate',
                ids: [
                    183013,
                    183031,
                ],
            },
            {
                label: 'Back',
                ids: [
                    184778,
                ],
            },
            {
                label: 'Jewelry',
                ids: [
                    183035,
                ],
            },
        ],
        ilvlStep: 13,
        ilvlRange: {
            min: 187,
            max: 187 + (13 * 3),
        },
    },
    [Tier.Shadowlands]: {
        name: 'Shadowlands World Drops',
        iconPath: '0-shadowlands.png',
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
    },
    [Tier.Nyalotha]: {
        name: "Ny'alotha, the Waking City",
        iconPath: '24-nyalotha.png',
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
    },
}
