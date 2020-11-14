import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import Constants, { getIlvlRange, Region, Tertiary, Tier } from '@common/Constants'

// ----------------------------------------------------------------------------
// Store
// ----------------------------------------------------------------------------

export interface IIlvlRange {
    min: number,
    max: number,
}

export enum SavedFiltersFields {
    region = 'region',
    realm = 'realm',

    tier = 'tier',

    boes = 'boes',
    ilvlRange = 'ilvlRange',
    maxBuyout = 'maxBuyout',
    mustHaveSocket = 'mustHaveSocket',
    tertiaries = 'tertiaries',
}

export type SavedFilters = {
    [key in SavedFiltersFields]?: string
}

export interface IRootState {
    region: Region | null
    realm: number | null
    lastModified: number | null

    tier: Tier | null

    boes: Set<number>
    ilvlRange: IIlvlRange
    maxBuyout: number
    mustHaveSocket: boolean
    tertiaries: Set<Tertiary>
}

const store = new Vuex.Store<IRootState>({
    // Checks state changes only happen in mutation handlers
    strict: Constants.IS_DEV,

    state: {
        region: null,
        realm: null,
        lastModified: null,

        tier: null,

        // We could alteratively save these states in a new obj and index them by tier i.e. { [key in Tier]: {...} }
        // However this would make it impractical to save the entire store as an URL query
        // There's probably a bigger use case for sharing URLs than people trying to compare items between multiple tiers
        // In addition, there's probably no sellers for non-current tier items so it's also pointless to compare
        // Therefore we will keep things simple and reset the tier-related item states whenever we change tiers
        boes: new Set(),
        ilvlRange: {
            min: -1,
            max: -1,
        },
        maxBuyout: Constants.MAX_GOLD,
        mustHaveSocket: false,
        tertiaries: new Set(),
    },

    mutations: {
        changeRegion(state: IRootState, region: Region | null): void {
            state.region = region
            state.realm = null
        },

        changeRealm(state: IRootState, realm: number | null): void {
            state.realm = realm
        },

        changeLastModified(state: IRootState, lastModified: number | null): void {
            state.lastModified = lastModified
        },

        changeTier(state: IRootState, tier: Tier | null): void {
            state.tier = tier
            state.boes = new Set()
            state.ilvlRange = getIlvlRange(tier)
        },

        changeBoes(state: IRootState, boes: Set<number>): void {
            state.boes = boes
        },

        changeIlvlRange(state: IRootState, ilvlRange: { min: number, max: number }): void {
            state.ilvlRange = ilvlRange
        },

        changeMaxBuyout(state: IRootState, maxBuyout: number): void {
            state.maxBuyout = maxBuyout
        },

        changeMustHaveSocket(state: IRootState, mustHaveSocket: boolean) {
            state.mustHaveSocket = mustHaveSocket
        },

        changeTertiaries(state: IRootState, tertiaries: Set<Tertiary>) {
            state.tertiaries = tertiaries
        },
    },
})

export default store
