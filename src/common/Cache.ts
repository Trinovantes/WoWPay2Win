import type { ItemModifier } from './ItemModifier.ts'
import type { RegionLocale } from './RegionConfig.ts'

// ----------------------------------------------------------------------------
// Region
// ----------------------------------------------------------------------------

export type Realm = {
    id: number
    name: string
}

export type ConnectedRealm = {
    id: number
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
    baseLevel: number
}

// ----------------------------------------------------------------------------
// RegionAuctions
// ----------------------------------------------------------------------------

export type ItemAuction = {
    id: number
    crId: number
    itemId: number
    buyout: number
    bonusIds?: Array<number>
    modifiers?: Array<ItemModifier>
}

export type RegionAuctions = {
    lastUpdate: number // from Date.now()
    tokenPrice: number // gold
    auctions: Array<ItemAuction>
}
