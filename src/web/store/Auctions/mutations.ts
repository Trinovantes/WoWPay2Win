import { MutationTree } from 'vuex'
import { AuctionsState } from '.'

// ----------------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------------

export enum AuctionsMutation {
    SET_LAST_UPDATE = 'SET_LAST_UPDATE',
}

// ----------------------------------------------------------------------------
// BasicMutations
// ----------------------------------------------------------------------------

export interface AuctionsMutations {
    [AuctionsMutation.SET_LAST_UPDATE]: (state: AuctionsState, payload?: number) => void
}

export const mutations: MutationTree<AuctionsState> & AuctionsMutations = {
    [AuctionsMutation.SET_LAST_UPDATE]: (state, payload?) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.lastUpdate = payload
    },
}
