import { defineStore } from 'pinia'
import { getConnectedRealmIds } from '../../utils/getConnectedRealmIds'
import { useFilterStore } from '../Filter'
import { ItemAuction, RegionAuctions } from '@/common/Cache'
import { RegionSlug } from '@/common/RegionConfig'
import { formatDistance } from 'date-fns'

// ----------------------------------------------------------------------------
// Store
// ----------------------------------------------------------------------------

export type Auctions = Array<ItemAuction>

export type AuctionsState = {
    auctions: Map<RegionSlug, RegionAuctions>
}

export function createDefaultAuctionsState(): AuctionsState {
    const defaultState: AuctionsState = {
        auctions: new Map(),
    }

    return defaultState
}

export const useAuctionsStore = defineStore('Auctions', {
    state: createDefaultAuctionsState,

    getters: {
        tokenPrice: (state): number | undefined => {
            const filterStore = useFilterStore()
            if (filterStore.region === null) {
                return
            }

            const tokenPrice = state.auctions.get(filterStore.region)?.tokenPrice
            if (tokenPrice === undefined) {
                return
            }

            return tokenPrice
        },

        lastUpdateIso: (state) => {
            const filterStore = useFilterStore()
            if (filterStore.region === null) {
                return ''
            }

            const lastUpdate = state.auctions.get(filterStore.region)?.lastUpdate
            if (lastUpdate === undefined) {
                return ''
            }

            return new Date(lastUpdate).toISOString()
        },

        lastUpdateFull: (state) => {
            const filterStore = useFilterStore()
            if (filterStore.region === null) {
                return ''
            }

            const lastUpdate = state.auctions.get(filterStore.region)?.lastUpdate
            if (lastUpdate === undefined) {
                return ''
            }

            return new Date(lastUpdate).toString()
        },

        lastUpdateFromNow: (state) => {
            const filterStore = useFilterStore()
            if (filterStore.region === null) {
                return ''
            }

            const lastUpdate = state.auctions.get(filterStore.region)?.lastUpdate
            if (lastUpdate === undefined) {
                return ''
            }

            return formatDistance(lastUpdate, new Date(), { addSuffix: true })
        },

        filteredAuctions: (state) => {
            const filterStore = useFilterStore()
            if (filterStore.region === null) {
                return []
            }

            // If the user filtered by realms, we need to find their corresponding parent crIds
            const connectedRealms = getConnectedRealmIds(filterStore.region, filterStore.realms)

            // Get and filter auctions
            const auctions = state.auctions.get(filterStore.region)?.auctions ?? []
            return auctions.filter((auction) => {
                if (!filterStore.showAuction(auction)) {
                    return false
                }
                if (connectedRealms.size > 0 && !connectedRealms.has(auction.crId)) {
                    return false
                }

                return true
            })
        },
    },

    actions: {
        async loadAuctions(regionSlug: RegionSlug): Promise<void> {
            const regionAuctions = this.auctions.get(regionSlug)
            const regionExpired = (Date.now() - (regionAuctions?.lastUpdate ?? 0)) > (3600 * 1000) // Expire after 1 hour
            if (!regionExpired) {
                return
            }

            const auctionsFile = `/data/auctions-${regionSlug}.json`
            const response = await fetch(auctionsFile)
            const auctions = await response.json() as RegionAuctions
            this.auctions.set(regionSlug, auctions)
        },
    },
})
