import { RegionSlug } from '@/common/Constants'
import { ActionContext, ActionTree } from 'vuex'
import { AuctionsState, cachedRequests } from '.'
import { AuctionsMutation, AuctionsMutations } from './mutations'
import axios from 'axios'
import { RegionAuctionsData } from '@/common/Data'

// ----------------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------------

export enum AuctionsAction {
    LOAD_AUCTIONS = 'LOAD_AUCTIONS',
}

// ----------------------------------------------------------------------------
// Actions
// ----------------------------------------------------------------------------

/* eslint-disable no-use-before-define */
type AugmentedActionContext = {
    commit<K extends keyof AuctionsMutations>(
        key: K,
        payload?: Parameters<AuctionsMutations[K]>[1]
    ): ReturnType<AuctionsMutations[K]>
    dispatch<K extends keyof AuctionsActions>(
        key: K,
        payload?: Parameters<AuctionsActions[K]>[1]
    ): ReturnType<AuctionsActions[K]>
} & Omit<ActionContext<AuctionsState, AuctionsState>, 'commit' | 'dispatch'>

export interface AuctionsActions {
    [AuctionsAction.LOAD_AUCTIONS]: (context: AugmentedActionContext, payload?: RegionSlug) => Promise<void>
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
