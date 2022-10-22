import axios from 'axios'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { auctionHasSocket } from '../../utils/auctionHasSocket'
import { getAuctionIlvl } from '../../utils/getAuctionIlvl'
import { getAuctionTertiary } from '../../utils/getAuctionTertiary'
import { getConnectedRealmIds } from '../../utils/getConnectedRealmIds'
import { useFilterStore } from '../Filter'
import type { ItemAuction, RegionAuctions } from '@/common/Cache'
import type { RegionSlug } from '@/common/RegionConfig'

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
            if (!filterStore.region) {
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
            if (!filterStore.region) {
                return ''
            }

            const lastUpdate = state.auctions.get(filterStore.region)?.lastUpdate
            if (lastUpdate === undefined) {
                return ''
            }

            return dayjs(lastUpdate).toISOString()
        },

        lastUpdateFull: (state) => {
            const filterStore = useFilterStore()
            if (!filterStore.region) {
                return ''
            }

            const lastUpdate = state.auctions.get(filterStore.region)?.lastUpdate
            if (lastUpdate === undefined) {
                return ''
            }

            return dayjs(lastUpdate).format('ll LT')
        },

        lastUpdateFromNow: (state) => {
            const filterStore = useFilterStore()
            if (!filterStore.region) {
                return ''
            }

            const lastUpdate = state.auctions.get(filterStore.region)?.lastUpdate
            if (lastUpdate === undefined) {
                return ''
            }

            return dayjs(lastUpdate).fromNow()
        },

        filteredAuctions: (state) => {
            const filterStore = useFilterStore()
            if (!filterStore.region) {
                return []
            }

            // If the user filtered by realms, we need to find their corresponding parent crIds
            const connectedRealms = getConnectedRealmIds(filterStore.region, filterStore.realms)

            // Get and filter auctions
            const auctions = state.auctions.get(filterStore.region)?.auctions ?? []
            return auctions.filter((auction) => {
                if (!filterStore.boes.has(auction.itemId)) {
                    return false
                }

                const auctionIlvl = getAuctionIlvl(auction)
                if (auctionIlvl < filterStore.ilvlRange.min || auctionIlvl > filterStore.ilvlRange.max) {
                    return false
                }

                if (auction.buyout > filterStore.maxBuyout) {
                    return false
                }

                const hasSocket = !auctionHasSocket(auction)
                if (filterStore.mustHaveSocket && hasSocket) {
                    return false
                }

                const tertiary = getAuctionTertiary(auction)
                if (filterStore.tertiaries.size > 0 && (!tertiary || !filterStore.tertiaries.has(tertiary))) {
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
            const response = await axios.get<RegionAuctions>(auctionsFile)
            this.auctions.set(regionSlug, response.data)
        },
    },
})
