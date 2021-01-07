import { IIlvlRange } from '@store/AppStore'
import dayjs, { Dayjs } from 'dayjs'
import _ from 'lodash'

const isDev = (process.env.NODE_ENV === 'development')

// ----------------------------------------------------------------------------
// Default
// ----------------------------------------------------------------------------

export default {
    IS_DEV: isDev,
    APP_NAME: 'WoWPay2Win',
    APP_DESC: 'This tool scans for BoEs in every auction house across the region. To buy an item, you need to either transfer a character with gold or buy tokens on that realm.',
    OG_DESC: 'Tired of being bad in World of Warcraft? Just swipe your credit card and buy your BiS gear off the auction house!',

    API_TIMEOUT: 30 * 1000, // in ms
    CONCURRENT_API_REQUESTS: isDev ? 1 : 20,
    MAX_API_RETRIES: isDev ? 1 : 5,

    GOLD_CAP: 10 * 1000 * 1000,

    ROWS_PER_PAGE: 50,
}

// ----------------------------------------------------------------------------
// Region
// ----------------------------------------------------------------------------

export enum RegionSlug {
    US = 'us',
    EU = 'eu',
    TW = 'tw',
    KR = 'kr',
}

export enum Locale {
    EN_US = 'en_US',
    EN_GB = 'en_GB',
    ZH_TW = 'zh_TW',
    KO_KR = 'ko_KR',
}

export interface RegionConfig {
    readonly slug: RegionSlug
    readonly locale: Locale
    readonly apiHost: string
    readonly oauthEndpoint: string
}

export const RegionConfigs: Array<RegionConfig> = [
    {
        slug: RegionSlug.US,
        locale: Locale.EN_US,
        apiHost: 'https://us.api.blizzard.com',
        oauthEndpoint: 'https://us.battle.net/oauth/token',
    },
    {
        slug: RegionSlug.EU,
        locale: Locale.EN_GB,
        apiHost: 'https://eu.api.blizzard.com',
        oauthEndpoint: 'https://eu.battle.net/oauth/token',
    },
    {
        slug: RegionSlug.TW,
        locale: Locale.ZH_TW,
        apiHost: 'https://tw.api.blizzard.com',
        oauthEndpoint: 'https://apac.battle.net/oauth/token',
    },
    {
        slug: RegionSlug.KR,
        locale: Locale.KO_KR,
        apiHost: 'https://kr.api.blizzard.com',
        oauthEndpoint: 'https://apac.battle.net/oauth/token',
    },
]

export function getRegionLocale(regionSlug: RegionSlug): Locale {
    for (const regionConfig of RegionConfigs) {
        if (regionConfig.slug === regionSlug) {
            return regionConfig.locale
        }
    }

    throw new Error(`Cannot find locale for region ${regionSlug}`)
}

// ----------------------------------------------------------------------------
// Tier
//
// Use this script to quickly extract item ids from wowhead item search
// https://www.wowhead.com/items/quality:4?filter=3:166:128:16;1:8:4:13224;0:0:0:0
/*
$('#tab-items table').find('a.q4').each((idx, el) => {
    const href = $(el).attr('href')
    const id = /(\d+)/.exec(href)[0]
    console.log(id, href)
})
*/
// ----------------------------------------------------------------------------

export enum Tier {
    // BfA
    Nyalotha = 't26',

    // Shadowlands
    Shadowlands = 'shadowlands',
    CastleNathria = 't27',
}

const DEFAULT_TIER = Tier.CastleNathria

export interface IBoeCategory {
    label: string
    ids: Set<number>
}

export interface TierConfig {
    readonly name: string
    readonly iconPath: string
    readonly expiration?: Dayjs
    readonly boes: Array<IBoeCategory>
    readonly ilvls: {
        min: number
        max: number
        step: number
    }
}

export const TierConfigs: {[key in Tier]: TierConfig} = {
    [Tier.Nyalotha]: {
        name: "Ny'alotha, the Waking City",
        iconPath: 'nyalotha.png',
        expiration: dayjs('2020-11-23'),
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
    [Tier.Shadowlands]: {
        name: 'Shadowlands World Drops',
        iconPath: 'shadowlands.png',
        expiration: dayjs('2020-12-09'),
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
                label: 'Cloak',
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
    [Tier.CastleNathria]: {
        name: 'Castle Nathria',
        iconPath: 'castle-nathria.png',
        boes: [
            {
                label: 'Cloth',
                ids: new Set([
                    183008,
                    183017,
                ]),
            },
            {
                label: 'Mail',
                ids: new Set([
                    183010,
                    182978,
                ]),
            },
            {
                label: 'Leather',
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
                label: 'Misc.',
                ids: new Set([
                    183035,
                    184778,
                ]),
            },
        ],
        ilvls: {
            min: 187,
            max: 226,
            step: 13,
        },
    },
}

export function getDefaultTier(): Tier {
    const today = dayjs()

    for (const [tier, tierConfig] of Object.entries(TierConfigs)) {
        if (!tierConfig.expiration) {
            continue
        }

        if (today.isBefore(tierConfig.expiration)) {
            return tier as unknown as Tier
        }
    }

    return DEFAULT_TIER
}

export function getIlvlRange(tier: Tier | null): IIlvlRange {
    if (!tier) {
        return {
            min: Number.MIN_SAFE_INTEGER,
            max: Number.MAX_SAFE_INTEGER,
        }
    }

    return _.pick(TierConfigs[tier].ilvls, ['min', 'max'])
}

export function getTierBoeIds(tier: Tier | null): Array<number> {
    if (!tier) {
        return []
    }

    const tierConfig = TierConfigs[tier]
    const boeIds: Array<number> = []

    for (const category of tierConfig.boes) {
        for (const id of category.ids) {
            boeIds.push(id)
        }
    }

    return boeIds
}

export function getBoeIds(): Array<number> {
    const boeIds: Array<number> = []

    for (const tier of Object.keys(TierConfigs)) {
        boeIds.push(...getTierBoeIds(tier as Tier))
    }

    return boeIds
}

// ----------------------------------------------------------------------------
// Item Bonus IDs
// ----------------------------------------------------------------------------

export enum Tertiary {
    Avoidance = 40,
    Leech = 41,
    Speed = 42,
    Indestructible = 43
}
