import { deepFreeze } from './utils/deepFreeze'

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

export type RegionConfig = {
    slug: RegionSlug
    locale: Locale
    apiHost: string
    oauthEndpoint: string
}

export const REGION_CONFIGS: ReadonlyArray<RegionConfig> = deepFreeze([
    {
        slug: RegionSlug.US,
        locale: Locale.EN_US,
        apiHost: 'https://us.api.blizzard.com',
        oauthEndpoint: 'https://oauth.battle.net/token',
    },
    {
        slug: RegionSlug.EU,
        locale: Locale.EN_GB,
        apiHost: 'https://eu.api.blizzard.com',
        oauthEndpoint: 'https://oauth.battle.net/token',
    },
    {
        slug: RegionSlug.TW,
        locale: Locale.ZH_TW,
        apiHost: 'https://tw.api.blizzard.com',
        oauthEndpoint: 'https://oauth.battle.net/token',
    },
    {
        slug: RegionSlug.KR,
        locale: Locale.KO_KR,
        apiHost: 'https://kr.api.blizzard.com',
        oauthEndpoint: 'https://oauth.battle.net/token',
    },
])

type LocalCurrencyAmount = number
export const tokenPrices = new Map<RegionSlug, LocalCurrencyAmount>([
    [RegionSlug.US, 20],
    [RegionSlug.EU, 20],
    [RegionSlug.KR, 22000],
    [RegionSlug.TW, 500],
])

export const currencyFormatters = new Map<RegionSlug, Intl.NumberFormat>([
    [RegionSlug.US, new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' })],
    [RegionSlug.EU, new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' })],
    [RegionSlug.KR, new Intl.NumberFormat(undefined, { style: 'currency', currency: 'KRW' })],
    [RegionSlug.TW, new Intl.NumberFormat(undefined, { style: 'currency', currency: 'TWD' })],
])
