import type { Locale } from './RegionConfig'

// ----------------------------------------------------------------------------
// Region
// ----------------------------------------------------------------------------

export interface Realm {
    id: number
    name: string
}

export interface ConnectedRealm {
    id: number
    realms: Array<Realm>
}

export interface Region {
    connectedRealms: Array<ConnectedRealm>
}

// ----------------------------------------------------------------------------
// Item
// ----------------------------------------------------------------------------

export interface Item {
    localizedName: Partial<Record<Locale, string>>
    baseLevel: number
}

// ----------------------------------------------------------------------------
// ItemAuction
// ----------------------------------------------------------------------------

export interface ItemAuction {
    id: number
    crId: number
    itemId: number
    buyout: number
    bonuses: Array<number>
}

export interface RegionAuctions {
    lastUpdate: number // from Date.now()
    auctions: Array<ItemAuction>
}
