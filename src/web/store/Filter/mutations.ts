import { IlvlRange, Tier } from '@/common/Constants'
import { getIlvlRange } from '@/common/utils'
import { MutationTree } from 'vuex'
import { BoeFilter, FilterState, RealmFilter, RegionFilter, TertiaryFilter } from '.'

// ----------------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------------

export enum FilterMutation {
    SET_TIER = 'SET_TIER',
    SET_REGION = 'SET_REGION',
    SET_REALMS = 'SET_REALMS',
    SET_BOES = 'SET_BOES',
    SET_ILVL_RANGE = 'SET_ILVL_RANGE',
    SET_MAX_BUYOUT = 'SET_MAX_BUYOUT',
    SET_MUST_HAVE_SOCKET = 'SET_MUST_HAVE_SOCKET',
    SET_TERTIARIES = 'SET_TERTIARIES',
}

// ----------------------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------------------

export interface FilterMutations {
    [FilterMutation.SET_TIER]: (state: FilterState, payload?: Tier) => void
    [FilterMutation.SET_REGION]: (state: FilterState, payload?: RegionFilter) => void
    [FilterMutation.SET_REALMS]: (state: FilterState, payload?: RealmFilter) => void
    [FilterMutation.SET_BOES]: (state: FilterState, payload?: BoeFilter) => void
    [FilterMutation.SET_ILVL_RANGE]: (state: FilterState, payload?: IlvlRange) => void
    [FilterMutation.SET_MAX_BUYOUT]: (state: FilterState, payload?: number) => void
    [FilterMutation.SET_MUST_HAVE_SOCKET]: (state: FilterState, payload?: boolean) => void
    [FilterMutation.SET_TERTIARIES]: (state: FilterState, payload?: TertiaryFilter) => void
}

export const mutations: MutationTree<FilterState> & FilterMutations = {
    [FilterMutation.SET_TIER]: (state: FilterState, payload?: Tier) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.tier = payload
        state.boes = new Set()
        state.ilvlRange = getIlvlRange(state.tier)
    },

    [FilterMutation.SET_REGION]: (state: FilterState, payload?: RegionFilter) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.region = payload
        state.realms = new Set()
    },

    [FilterMutation.SET_REALMS]: (state: FilterState, payload?: RealmFilter) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.realms = payload
    },

    [FilterMutation.SET_BOES]: (state: FilterState, payload?: BoeFilter) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.boes = payload
    },

    [FilterMutation.SET_ILVL_RANGE]: (state: FilterState, payload?: IlvlRange) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.ilvlRange = payload
    },

    [FilterMutation.SET_MAX_BUYOUT]: (state: FilterState, payload?: number) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.maxBuyout = payload
    },

    [FilterMutation.SET_MUST_HAVE_SOCKET]: (state: FilterState, payload?: boolean) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.mustHaveSocket = payload
    },

    [FilterMutation.SET_TERTIARIES]: (state: FilterState, payload?: TertiaryFilter) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.tertiaries = payload
    },
}
