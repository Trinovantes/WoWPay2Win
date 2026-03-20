import type { AuctionId, BonusId, ConnectedRealmId, ItemId, RealmId } from './api/BnetResponse.ts'
import type { ItemModifier } from './ItemModifier.ts'
import type { RegionLocale } from './RegionConfig.ts'

// ----------------------------------------------------------------------------
// Region
// ----------------------------------------------------------------------------

export type Realm = {
    id: RealmId
    name: string
}

export type ConnectedRealm = {
    id: ConnectedRealmId
    realms: Array<Realm>
}

export type Region = {
    connectedRealms: Array<ConnectedRealm>
}

// ----------------------------------------------------------------------------
// Item
// ----------------------------------------------------------------------------

export type Item = {
    localizedName: Partial<Record<RegionLocale, string>>
}

// ----------------------------------------------------------------------------
// RegionAuctions
// ----------------------------------------------------------------------------

export type ItemAuction = {
    id: AuctionId
    crId: ConnectedRealmId
    itemId: ItemId
    buyout: number
    bonusIds?: Array<BonusId>
    modifiers?: Array<ItemModifier>
}

export type RegionAuctions = {
    lastUpdate: number // from Date.now()
    tokenPrice: number // gold
    auctions: Array<ItemAuction>
}
