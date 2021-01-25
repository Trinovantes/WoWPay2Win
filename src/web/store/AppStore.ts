import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import Constants, { getIlvlRange, RegionSlug, Tier } from '@common/Constants'
import { Tertiary } from '@common/Bonuses'
import { setEq } from '@common/utils'

// ----------------------------------------------------------------------------
// Store
// ----------------------------------------------------------------------------

export interface IIlvlRange {
    min: number
    max: number
}

export enum SavedFiltersFields {
    region = 'region',
    realms = 'realms',

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
    region: RegionSlug | null
    realms: Set<number>
    lastModified: number | null

    tier: Tier | null

    boes: Set<number>
    ilvlRange: IIlvlRange
    maxBuyout: number
    mustHaveSocket: boolean
    tertiaries: Set<Tertiary>
}

export function createDefaultState(): IRootState {
    return {
        region: null,
        realms: new Set(),
        lastModified: null,

        tier: null,

        // We could alteratively save these states in a new obj and index them by tier i.e. { [key in Tier]: {...} }
        // However this would make it impractical to save the entire store as an URL query
        // There's probably a bigger use case for sharing URLs than people trying to compare items between multiple tiers
        // In addition, there's probably no sellers for non-current tier items so it's also pointless to compare
        // Therefore we will keep things simple and reset the tier-related item states whenever we change tiers
        boes: new Set(),
        ilvlRange: getIlvlRange(null),
        maxBuyout: Constants.GOLD_CAP,
        mustHaveSocket: false,
        tertiaries: new Set(),
    }
}

const AppStore = new Vuex.Store<IRootState>({
    // Checks state changes only happen in mutation handlers
    strict: DEFINE.IS_DEV,

    state: createDefaultState,

    mutations: {
        changeRegion(state: IRootState, region: RegionSlug | null): void {
            if (state.region === region) {
                return
            }

            state.region = region
            state.realms = new Set()
        },

        changeRealms(state: IRootState, realms: Set<number>): void {
            if (setEq(state.realms, realms)) {
                return
            }

            state.realms = realms
        },

        changeLastModified(state: IRootState, lastModified: number | null): void {
            state.lastModified = lastModified
        },

        changeTier(state: IRootState, tier: Tier | null): void {
            if (state.tier === tier) {
                return
            }

            state.tier = tier
            state.boes = new Set()
            state.ilvlRange = getIlvlRange(tier)
        },

        changeBoes(state: IRootState, boes: Set<number>): void {
            if (setEq(state.boes, boes)) {
                return
            }

            state.boes = boes
        },

        changeIlvlRange(state: IRootState, ilvlRange: IIlvlRange): void {
            if (state.ilvlRange.min === ilvlRange.min && state.ilvlRange.max === ilvlRange.max) {
                return
            }

            state.ilvlRange = ilvlRange
        },

        changeMaxBuyout(state: IRootState, maxBuyout: number): void {
            if (state.maxBuyout === maxBuyout) {
                return
            }

            state.maxBuyout = maxBuyout
        },

        changeMustHaveSocket(state: IRootState, mustHaveSocket: boolean) {
            if (state.mustHaveSocket === mustHaveSocket) {
                return
            }

            state.mustHaveSocket = mustHaveSocket
        },

        changeTertiaries(state: IRootState, tertiaries: Set<Tertiary>) {
            if (setEq(state.tertiaries, tertiaries)) {
                return
            }

            state.tertiaries = tertiaries
        },
    },
})

export default AppStore
