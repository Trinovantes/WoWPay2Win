export type RegionSlug = 'us' | 'eu' | 'tw' | 'kr'
export type RegionLocale = 'en_US' | 'en_GB' | 'zh_TW' | 'ko_KR'

export type RegionConfig = Readonly<{
    slug: RegionSlug
    locale: RegionLocale
    apiHost: string
    oauthEndpoint: string
}>

export const regionConfigs: ReadonlyArray<RegionConfig> = [
    {
        slug: 'us',
        locale: 'en_US',
        apiHost: 'https://us.api.blizzard.com',
        oauthEndpoint: 'https://oauth.battle.net/token',
    },
    {
        slug: 'eu',
        locale: 'en_GB',
        apiHost: 'https://eu.api.blizzard.com',
        oauthEndpoint: 'https://oauth.battle.net/token',
    },
    {
        slug: 'tw',
        locale: 'zh_TW',
        apiHost: 'https://tw.api.blizzard.com',
        oauthEndpoint: 'https://oauth.battle.net/token',
    },
    {
        slug: 'kr',
        locale: 'ko_KR',
        apiHost: 'https://kr.api.blizzard.com',
        oauthEndpoint: 'https://oauth.battle.net/token',
    },
]

export const tokenPrices = new Map<RegionSlug, number>([
    ['us', 20],
    ['eu', 20],
    ['kr', 22000],
    ['tw', 500],
])

export const currencyFormatters = new Map<RegionSlug, Intl.NumberFormat>([
    ['us', new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' })],
    ['eu', new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' })],
    ['kr', new Intl.NumberFormat(undefined, { style: 'currency', currency: 'KRW' })],
    ['tw', new Intl.NumberFormat(undefined, { style: 'currency', currency: 'TWD' })],
])
