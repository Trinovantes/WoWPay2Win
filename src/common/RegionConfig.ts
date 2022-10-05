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
])
