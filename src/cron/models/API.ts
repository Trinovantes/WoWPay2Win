/* eslint-disable camelcase */

export interface IRegionResponse {
    connected_realms: Array<{
        href: string,
    }>
}

export interface IConnectedRealmResponse {
    id: number,
    realms: Array<{
        id: number,
        name: string,
    }>
}

export interface IItemResponse {
    id: number,
    name: string,
    level: number,
}

export interface IItemMediaResponse {
    id: number,
    assets: Array<{
        key: string,
        value: string,
    }>
}

export interface IAuctionsResponse {
    auctions?: Array<{
        id: number,
        item: {
            id: number,
            bonus_lists?: Array<number>
        },
        buyout?: number,
    }>
}
