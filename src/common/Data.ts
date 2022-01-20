import { Tertiary } from '@/common/BonusId'
import { Locale } from '@/common/Constants'

export abstract class Data {}

// ----------------------------------------------------------------------------
// Region
// ----------------------------------------------------------------------------

export interface RealmData {
    id: number
    name: string
}

export interface ConnectedRealmData {
    id: number
    realms: Array<RealmData>
}

export interface RegionCache extends Data {
    connectedRealms: Array<ConnectedRealmData>
}

// ----------------------------------------------------------------------------
// Item
// ----------------------------------------------------------------------------

export interface ItemData extends Data {
    localizedName: Partial<Record<Locale, string>>
    baseLevel: number
    iconUrl: string | null
}

// ----------------------------------------------------------------------------
// ItemAuction
// ----------------------------------------------------------------------------

export interface ItemAuctionData {
    id: number
    crId: number
    itemId: number
    buyout: number
    bonuses: Array<number>

    bonusIlvl?: number
    hasSocket?: boolean
    tertiary?: Tertiary
}

export interface RegionAuctionsData extends Data {
    lastUpdate: number // from Date.now()
    auctions: Array<ItemAuctionData>
}
