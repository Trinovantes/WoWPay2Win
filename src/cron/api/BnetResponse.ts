/* eslint-disable camelcase */

export type BnetOauthResponse = {
    access_token: string
}

export type BnetRegionResponse = {
    connected_realms: Array<{
        href: string
    }>
}

export type BnetConnectedRealmResponse = {
    id: number
    realms: Array<{
        id: number
        name: string
    }>
}

export type BnetItemResponse = {
    id: number
    name: string
    level: number
}

export type BnetItemMediaResponse = {
    id: number
    assets: Array<{
        key: string
        value: string
    }>
}

export type BnetAuctionsResponse = {
    auctions?: Array<{
        id: number
        item: {
            id: number
            bonus_lists?: Array<number>
        }
        buyout?: number
    }>
}
