import { RegionSlug } from '@/common/Constants'
import { ActionContext, ActionTree } from 'vuex'
import { AuctionsState, cachedRequests } from '.'
import { AuctionsMutation, AuctionsMutations } from './mutations'
import axios from 'axios'
import { RegionAuctionsData } from '@/common/Data'
import { AuctionsGetters } from './getters'

// ----------------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------------

export enum AuctionsAction {
    LOAD_AUCTIONS = 'LOAD_AUCTIONS',
}

// ----------------------------------------------------------------------------
// Actions
// ----------------------------------------------------------------------------

type TypedActionContext = Omit<ActionContext<AuctionsState, AuctionsState>, 'commit' | 'dispatch' | 'getters' | 'rootState' | 'rootGetters'> & {
    commit<K extends keyof AuctionsMutations>(
        key: K,
        payload?: Parameters<AuctionsMutations[K]>[1]
    ): ReturnType<AuctionsMutations[K]>

    // eslint-disable-next-line no-use-before-define
    dispatch<K extends keyof AuctionsActions>(
        key: K,
        // eslint-disable-next-line no-use-before-define
        payload?: Parameters<AuctionsActions[K]>[1]
    // eslint-disable-next-line no-use-before-define
    ): ReturnType<AuctionsActions[K]>

    getters: {
        [K in keyof AuctionsGetters]: ReturnType<AuctionsGetters[K]>
    }
}

export interface AuctionsActions {
    [AuctionsAction.LOAD_AUCTIONS]: (context: TypedActionContext, payload?: RegionSlug) => Promise<void>
}

export const actions: ActionTree<AuctionsState, AuctionsState> & AuctionsActions = {
    [AuctionsAction.LOAD_AUCTIONS]: async({ commit }, payload?: RegionSlug) => {
        if (!payload) {
            throw new Error('Missing Payload')
        }

        // Already loaded auctions this session so we can skip reloading
        if (payload in cachedRequests) {
            return
        }

        try {
            const auctionsFile = `/data/auctions-${payload}.json`
            const response = await axios.get(auctionsFile)
            const auctionsData = response.data as RegionAuctionsData

            cachedRequests[payload] = auctionsData.auctions
            commit(AuctionsMutation.SET_LAST_UPDATE, auctionsData.lastUpdate)
        } catch (err) {
            console.warn(err)
        }
    },
}
