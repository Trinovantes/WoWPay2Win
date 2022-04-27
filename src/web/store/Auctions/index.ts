import axios from 'axios'
import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { useFilterStore } from '../Filter'
import type { RegionSlug } from '@/common/Constants'
import type { ItemAuctionData, RegionAuctionsData } from '@/common/Data'
import { getBaseIlvl, realmToConnectedRealmMaps } from '@/web/utils/GameData'

// ----------------------------------------------------------------------------
// Store
// ----------------------------------------------------------------------------

export type Auctions = Array<ItemAuctionData>

export interface AuctionsState {
    lastUpdate: number | null
    cachedRequests: Map<RegionSlug, RegionAuctionsData>
}

export function createDefaultAuctionsState(): AuctionsState {
    const defaultState: AuctionsState = {
        lastUpdate: null,
        cachedRequests: new Map(),
    }

    return defaultState
}

export const useAuctionsStore = defineStore('auctions', {
    state: createDefaultAuctionsState,

    getters: {
        lastUpdateIso: (state) => {
            if (state.lastUpdate === null) {
                return ''
            }

            return dayjs(state.lastUpdate).toISOString()
        },

        lastUpdateFull: (state) => {
            if (state.lastUpdate === null) {
                return ''
            }

            return dayjs(state.lastUpdate).format('ll LT')
        },

        lastUpdateFromNow: (state) => {
            if (state.lastUpdate === null) {
                return ''
            }

            return dayjs(state.lastUpdate).fromNow()
        },

        filteredAuctions: (state): Auctions => {
            const filterStore = useFilterStore()

            if (!filterStore.region) {
                return []
            }

            // If the user filtered by realms, we need to find their corresponding parent crIds
            const connectedRealms = new Set<number>()
            for (const realm of filterStore.realms) {
                const cr = realmToConnectedRealmMaps.get(filterStore.region)?.[realm]
                if (cr !== undefined) {
                    connectedRealms.add(cr)
                }
            }

            const auctions = state.cachedRequests.get(filterStore.region)?.auctions ?? []
            return auctions.filter((auction) => {
                if (!filterStore.boes.has(auction.itemId)) {
                    return false
                }

                const auctionIlvl = getBaseIlvl(auction.itemId) + (auction.bonusIlvl ?? 0)
                if (auctionIlvl < filterStore.ilvlRange.min || auctionIlvl > filterStore.ilvlRange.max) {
                    return false
                }

                if (auction.buyout > filterStore.maxBuyout) {
                    return false
                }

                if (filterStore.mustHaveSocket && !auction.hasSocket) {
                    return false
                }

                if (filterStore.tertiaries.size > 0 && (!auction.tertiary || !filterStore.tertiaries.has(auction.tertiary))) {
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
        async loadAuctions(regionSlug: RegionSlug) {
            try {
                const hasCachedRegion = this.cachedRequests.has(regionSlug)
                const cachedRegionExpired = (Date.now() - (this.cachedRequests.get(regionSlug)?.lastUpdate ?? 0)) > (3600 * 1000) // Expire after 1 hour

                if (!hasCachedRegion || cachedRegionExpired) {
                    const auctionsFile = `/data/auctions-${regionSlug}.json`
                    const response = await axios.get<RegionAuctionsData>(auctionsFile)
                    this.cachedRequests.set(regionSlug, response.data)
                }

                this.lastUpdate = this.cachedRequests.get(regionSlug)?.lastUpdate ?? null
            } catch (err) {
                console.warn(err)
            }
        },
    },
})
