import { Tertiary } from './Bonuses'
import { Locale } from './Constants'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICache {
}

// ----------------------------------------------------------------------------
// Region
// ----------------------------------------------------------------------------

export interface IRealmCache {
    id: number
    name: string
}

export interface IConnectedRealmCache {
    id: number
    realms: Array<IRealmCache>
}

export interface IRegionCache extends ICache {
    connectedRealms: Array<IConnectedRealmCache>
}

// ----------------------------------------------------------------------------
// Item
// ----------------------------------------------------------------------------

export interface IItemCache extends ICache {
    localizedName: { [key in Locale]?: string }
    baseLevel: number
    iconUrl: string | null
}

// ----------------------------------------------------------------------------
// ItemAuction
// ----------------------------------------------------------------------------

export interface IItemAuctionCache {
    id: number
    crId: number
    itemId: number
    buyout: number
    bonuses: Array<number>

    bonusIlvl?: number
    hasSocket?: boolean
    tertiary?: Tertiary
}

export interface IAuctionsCache extends ICache {
    lastUpdate: number
    auctions: Array<IItemAuctionCache>
}
