import { Tertiary } from '@/common/BonusId'
import { DEFAULT_TIER, GOLD_CAP, IlvlRange, RegionSlug, Tier } from '@/common/Constants'
import { getIlvlRange } from '@/common/utils'
import { computed, InjectionKey, watch } from 'vue'
import { Router } from 'vue-router'
import { CommitOptions, createStore, Store, useStore } from 'vuex'
import { mutations, FilterMutations } from './mutations'
import { exportFilters, importQuery } from '@/web/store/Filter/Query'

// ----------------------------------------------------------------------------
// Store
// ----------------------------------------------------------------------------

export type RegionFilter = RegionSlug | null
export type RealmFilter = Set<number>
export type BoeFilter = Set<number>
export type TertiaryFilter = Set<Tertiary>

export interface FilterState {
    tier: Tier
    region: RegionFilter
    realms: RealmFilter
    boes: BoeFilter
    ilvlRange: IlvlRange
    maxBuyout: number
    mustHaveSocket: boolean
    tertiaries: TertiaryFilter
}

export function createDefaultFilterState(): FilterState {
    const defaultState: FilterState = {
        tier: DEFAULT_TIER,
        region: null,
        realms: new Set(),

        /**
         * We could alteratively save these item filters in a new obj and index them by tier i.e. { [key in Tier]: {...} }
         * However:
         * - It is impractical to save the entire store as an URL query
         * - There's probably a bigger use case for sharing URLs than people trying to compare items between multiple tiers
         * - Unlikely to have sellers/buyers for non-current tier items so it's also pointless to compare
         *
         * Therefore we will keep things simple and reset the tier-related item states whenever we change tiers
         */
        boes: new Set(),
        ilvlRange: getIlvlRange(DEFAULT_TIER),
        maxBuyout: GOLD_CAP,
        mustHaveSocket: false,
        tertiaries: new Set(),
    }

    return defaultState
}

export async function createFilterStore(router: Router): Promise<Store<FilterState>> {
    const store = createStore<FilterState>({
        strict: DEFINE.IS_DEV,

        state: createDefaultFilterState,
        mutations,
    })

    // Avoid infinite loop due to one handler causing changes that will trigger the other handler
    let pendingHandler = false

    store.subscribe(async() => {
        if (pendingHandler) {
            return
        }

        pendingHandler = true
        const query = exportFilters(store.state)
        await router.replace({ query })
        pendingHandler = false
    })

    const query = computed(() => router.currentRoute.value.query)
    const loadQuery = async() => {
        if (pendingHandler) {
            return
        }

        pendingHandler = true
        const importedState = importQuery(query.value)
        const importedQuery = exportFilters(importedState)
        store.replaceState(importedState)
        await router.replace({ query: importedQuery })
        pendingHandler = false
    }

    watch(query, loadQuery)
    await loadQuery()

    return store
}

// ----------------------------------------------------------------------------
// TypeScript Helpers
// ----------------------------------------------------------------------------

type TypedStore = Omit<Store<FilterState>, 'commit' | 'dispatch' | 'getters'> & {
    commit<K extends keyof FilterMutations>(
        key: K,
        payload?: Parameters<FilterMutations[K]>[1],
        options?: CommitOptions
    ): ReturnType<FilterMutations[K]>
}

export const filterInjectionKey: InjectionKey<TypedStore> = Symbol('Vuex (Filter) InjectionKey')

export function useFilterStore(): TypedStore {
    return useStore(filterInjectionKey)
}
