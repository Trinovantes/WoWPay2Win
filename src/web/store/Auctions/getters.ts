import { GetterTree } from 'vuex'
import { Auctions, AuctionsState, cachedRequests } from '.'
import { FilterState } from '@/web/store/Filter'
import dayjs from 'dayjs'
import { getBaseIlvl, realmToConnectedRealmMaps } from '@/web/utils/GameData'

// ----------------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------------

export enum AuctionsGetter {
    FILTERED_AUCTIONS = 'FILTERED_AUCTIONS',
    LAST_UPDATE_ISO = 'LAST_UPDATE_ISO',
    LAST_UPDATE_STRING = 'LAST_UPDATE_STRING',
    LAST_UPDATE_FROM_NOW = 'LAST_UPDATE_FROM_NOW',
}

// ----------------------------------------------------------------------------
// Getters
// ----------------------------------------------------------------------------

export interface AuctionsGetters {
    [AuctionsGetter.FILTERED_AUCTIONS]: (state: AuctionsState) => ((filterState: FilterState) => Auctions)
    [AuctionsGetter.LAST_UPDATE_ISO]: (state: AuctionsState) => string
    [AuctionsGetter.LAST_UPDATE_STRING]: (state: AuctionsState) => string
    [AuctionsGetter.LAST_UPDATE_FROM_NOW]: (state: AuctionsState) => string
}

export const getters: GetterTree<AuctionsState, AuctionsState> & AuctionsGetters = {
    [AuctionsGetter.FILTERED_AUCTIONS]: () => {
        return (filterState) => {
            if (!filterState.region) {
                return []
            }

            const connectedRealms = new Set<number>()
            for (const realm of filterState.realms) {
                const cr = realmToConnectedRealmMaps.get(filterState.region)?.[realm]
                if (cr !== undefined) {
                    connectedRealms.add(cr)
                }
            }

            const auctions = cachedRequests.get(filterState.region)?.auctions ?? []
            return auctions.filter((auction) => {
                // Skip BoEs not selected by user
                if (!filterState.boes.has(auction.itemId)) {
                    return false
                }

                const auctionIlvl = getBaseIlvl(auction.itemId) + (auction.bonusIlvl ?? 0)
                if (auctionIlvl < filterState.ilvlRange.min || auctionIlvl > filterState.ilvlRange.max) {
                    return false
                }

                if (auction.buyout > filterState.maxBuyout) {
                    return false
                }

                if (filterState.mustHaveSocket && !auction.hasSocket) {
                    return false
                }

                if (filterState.tertiaries.size > 0 && (!auction.tertiary || !filterState.tertiaries.has(auction.tertiary))) {
                    return false
                }

                if (connectedRealms.size > 0 && !connectedRealms.has(auction.crId)) {
                    return false
                }

                return true
            })
        }
    },

    [AuctionsGetter.LAST_UPDATE_ISO]: (state: AuctionsState) => {
        if (state.lastUpdate === null) {
            return ''
        }

        return dayjs(state.lastUpdate).toISOString()
    },

    [AuctionsGetter.LAST_UPDATE_STRING]: (state: AuctionsState) => {
        if (state.lastUpdate === null) {
            return ''
        }

        return dayjs(state.lastUpdate).format('ll LT')
    },

    [AuctionsGetter.LAST_UPDATE_FROM_NOW]: (state: AuctionsState) => {
        if (state.lastUpdate === null) {
            return ''
        }

        return dayjs(state.lastUpdate).fromNow()
    },
}
