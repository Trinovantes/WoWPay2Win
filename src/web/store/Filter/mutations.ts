import { Tertiary } from '@/common/BonusId'
import { IlvlRange } from '@/common/Constants'
import { getIlvlRange } from '@/common/utils'
import { MutationTree } from 'vuex'
import { FilterState, RegionFilter, TierFilter } from '.'

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
// FilterMutations
// ----------------------------------------------------------------------------

export interface FilterMutations {
    [FilterMutation.SET_TIER]: (state: FilterState, payload?: TierFilter) => void
    [FilterMutation.SET_REGION]: (state: FilterState, payload?: RegionFilter) => void
    [FilterMutation.SET_REALMS]: (state: FilterState, payload?: Set<number>) => void
    [FilterMutation.SET_BOES]: (state: FilterState, payload?: Set<number>) => void
    [FilterMutation.SET_ILVL_RANGE]: (state: FilterState, payload?: IlvlRange) => void
    [FilterMutation.SET_MAX_BUYOUT]: (state: FilterState, payload?: number) => void
    [FilterMutation.SET_MUST_HAVE_SOCKET]: (state: FilterState, payload?: boolean) => void
    [FilterMutation.SET_TERTIARIES]: (state: FilterState, payload?: Set<Tertiary>) => void
}

export const mutations: MutationTree<FilterState> & FilterMutations = {
    [FilterMutation.SET_TIER]: (state, payload?) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.tier = payload
        state.boes = new Set()
        state.ilvlRange = getIlvlRange(state.tier)
    },

    [FilterMutation.SET_REGION]: (state, payload?) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.region = payload
        state.realms = new Set()
    },

    [FilterMutation.SET_REALMS]: (state, payload?) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.realms = payload
    },

    [FilterMutation.SET_BOES]: (state, payload?) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.boes = payload
    },

    [FilterMutation.SET_ILVL_RANGE]: (state, payload?) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.ilvlRange = payload
    },

    [FilterMutation.SET_MAX_BUYOUT]: (state, payload?) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.maxBuyout = payload
    },

    [FilterMutation.SET_MUST_HAVE_SOCKET]: (state, payload?) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.mustHaveSocket = payload
    },

    [FilterMutation.SET_TERTIARIES]: (state, payload?) => {
        if (payload === undefined) {
            throw new Error('Missing Payload')
        }

        state.tertiaries = payload
    },
}
