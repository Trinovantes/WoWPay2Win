/* eslint-disable camelcase */

export interface BnetOauthResponse {
    access_token: string
}

export interface BnetRegionResponse {
    connected_realms: Array<{
        href: string
    }>
}

export interface BnetConnectedRealmResponse {
    id: number
    realms: Array<{
        id: number
        name: string
    }>
}

export interface BnetItemResponse {
    id: number
    name: string
    level: number
}

export interface BnetItemMediaResponse {
    id: number
    assets: Array<{
        key: string
        value: string
    }>
}

export interface BnetAuctionsResponse {
    auctions?: Array<{
        id: number
        item: {
            id: number
            bonus_lists?: Array<number>
        }
        buyout?: number
    }>
}
