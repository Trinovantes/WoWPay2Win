import { deepFreeze } from './utils/deepFreeze'

/*
Use this script to quickly extract item ids from wowhead item search
https://www.wowhead.com/items/quality:4?filter=3:166:128:16;1:9:4:13224;0:0:0:0

$('#tab-items table').find('a.q4').each((idx, el) => {
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
}

export const DEFAULT_TIER = Tier.ShadowlandsFatedRaids

export interface BoeCategory {
    label: string
    ids: Set<number>
}

export interface IlvlRange {
    min: number
    max: number
}

export interface TierConfig {
    name: string
    iconPath: string
    boes: ReadonlyArray<BoeCategory>
    ilvls: IlvlRange & {
        step: number
    }
}

export const TIER_CONFIGS: Readonly<Record<Tier, TierConfig>> = deepFreeze({
    [Tier.ShadowlandsFatedRaids]: {
        name: 'Shadowlands Fated Raids',
        iconPath: '0-shadowlands.png',
        boes: [
            {
                label: 'Cloth',
                ids: new Set([
                    190630,
                    190631,
                    186356,
                    186358,
                    183008,
                    183017,
                ]),
            },
            {
                label: 'Leather',
                ids: new Set([
                    190627,
                    190626,
                    186362,
                    186359,
                    183010,
                    182978,
                ]),
            },
            {
                label: 'Mail',
                ids: new Set([
                    190629,
                    190628,
                    186367,
                    186364,
                    182990,
                    182982,
                ]),
            },
            {
                label: 'Plate',
                ids: new Set([
                    190625,
                    190624,
                    186373,
                    186371,
                    183013,
                    183031,
                ]),
            },
            {
                label: 'Back',
                ids: new Set([
                    190334,
                    184778,
                ]),
            },
            {
                label: 'Misc.',
                ids: new Set([
                    183035,
                ]),
            },
        ],
        ilvls: {
            min: 265,
            max: 304,
            step: 13,
        },
    },
    [Tier.SepulcherOfTheFirstOnes]: {
        name: 'Sepulcher of the First Ones',
        iconPath: '29-sepulcher-of-the-first-ones.png',
        boes: [
            {
                label: 'Cloth',
                ids: new Set([
                    190630,
                    190631,
                ]),
            },
            {
                label: 'Leather',
                ids: new Set([
                    190627,
                    190626,
                ]),
            },
            {
                label: 'Mail',
                ids: new Set([
                    190629,
                    190628,
                ]),
            },
            {
                label: 'Plate',
                ids: new Set([
                    190625,
                    190624,
                ]),
            },
            {
                label: 'Back',
                ids: new Set([
                    190334,
                ]),
            },
        ],
        ilvls: {
            min: 239,
            max: 278,
            step: 13,
        },
    },
    [Tier.SanctumOfDomination]: {
        name: 'Sanctum of Domination',
        iconPath: '28-sanctum-of-domination.png',
        boes: [
            {
                label: 'Cloth',
                ids: new Set([
                    186356,
                    186358,
                ]),
            },
            {
                label: 'Leather',
                ids: new Set([
                    186362,
                    186359,
                ]),
            },
            {
                label: 'Mail',
                ids: new Set([
                    186367,
                    186364,
                ]),
            },
            {
                label: 'Plate',
                ids: new Set([
                    186373,
                    186371,
                ]),
            },
        ],
        ilvls: {
            min: 213,
            max: 252,
            step: 13,
        },
    },
    [Tier.CastleNathria]: {
        name: 'Castle Nathria',
        iconPath: '26-castle-nathria.png',
        boes: [
            {
                label: 'Cloth',
                ids: new Set([
                    183008,
                    183017,
                ]),
            },
            {
                label: 'Leather',
                ids: new Set([
                    183010,
                    182978,
                ]),
            },
            {
                label: 'Mail',
                ids: new Set([
                    182990,
                    182982,
                ]),
            },
            {
                label: 'Plate',
                ids: new Set([
                    183013,
                    183031,
                ]),
            },
            {
                label: 'Back',
                ids: new Set([
                    184778,
                ]),
            },
            {
                label: 'Misc.',
                ids: new Set([
                    183035,
                ]),
            },
        ],
        ilvls: {
            min: 187,
            max: 226,
            step: 13,
        },
    },
    [Tier.Shadowlands]: {
        name: 'Shadowlands World Drops',
        iconPath: '0-shadowlands.png',
        boes: [
            {
                label: 'Trinket',
                ids: new Set([
                    184807,
                ]),
            },
            {
                label: 'Jewelry',
                ids: new Set([
                    184785,
                    184784,
                    184783,
                ]),
            },
            {
                label: 'Back',
                ids: new Set([
                    184782,
                    184781,
                ]),
            },
            {
                label: 'Weapon',
                ids: new Set([
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
                ]),
            },
            {
                label: 'Cloth',
                ids: new Set([
                    184786,
                    184787,
                    184788,
                ]),
            },
            {
                label: 'Leather',
                ids: new Set([
                    184790,
                    184791,
                    184789,
                ]),
            },
            {
                label: 'Mail',
                ids: new Set([
                    184793,
                    184794,
                    184792,
                ]),
            },
            {
                label: 'Plate',
                ids: new Set([
                    184795,
                    184796,
                    184808,
                    184809,
                ]),
            },
        ],
        ilvls: {
            min: 190,
            max: 207,
            step: 1,
        },
    },
    [Tier.Nyalotha]: {
        name: "Ny'alotha, the Waking City",
        iconPath: '24-nyalotha.png',
        boes: [
            {
                label: 'Raid BoEs',
                ids: new Set([
                    175004,
                    175005,
                    175010,
                    175009,
                    175008,
                    175007,
                    175006,
                ]),
            },
        ],
        ilvls: {
            min: 85,
            max: 85 + (15 * 3),
            step: 15,
        },
    },
})
