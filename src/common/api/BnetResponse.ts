import type { Brand } from '../../@types/Brand.ts'
import type { ItemContext } from '../ItemContext.ts'
import type { ItemModifier } from '../ItemModifier.ts'

export type ConnectedRealmId = Brand<number, 'ConnectedRealmId'>
export type RealmId = Brand<number, 'RealmId'>

export type AuctionId = Brand<number, 'AuctionId'>
export type ItemId = Brand<number, 'ItemId'>
export type BonusId = Brand<number, 'BonusId'>

export type BnetOauthResponse = {
    access_token: string
}

export type BnetRegionResponse = {
    connected_realms: Array<{
        href: string
    }>
}

export type BnetConnectedRealmResponse = {
    id: ConnectedRealmId
    realms: Array<{
        id: RealmId
        name: string
    }>
}

export type BnetItemResponse = {
    id: ItemId
    name: string
}

export type BnetItemMediaResponse = {
    assets: Array<{
        key: string
        value: string
    }>
}

export type BnetAuctionsResponse = {
    auctions?: Array<{
        id: AuctionId
        item: {
            id: ItemId
            context?: ItemContext
            bonus_lists?: Array<BonusId>
            modifiers?: Array<ItemModifier>
        }
        buyout?: number
    }>
}

export type BnetTokenResponse = {
    last_updated_timestamp: number
    price: number
}
