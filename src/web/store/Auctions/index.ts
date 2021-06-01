import { ItemAuctionData, RegionAuctionsData } from '@/common/Data'
import { computed, InjectionKey, watch } from 'vue'
import { CommitOptions, createStore, DispatchOptions, Store, useStore } from 'vuex'
import { actions, AuctionsAction, AuctionsActions } from './actions'
import { mutations, AuctionsMutations } from './mutations'
import { AuctionsGetters, getters } from './getters'
import { RegionSlug } from '@/common/Constants'
import { useFilterStore } from '@/web/store/Filter'

// ----------------------------------------------------------------------------
// Store
// ----------------------------------------------------------------------------

export type Auctions = Array<ItemAuctionData>
export const cachedRequests = new Map<RegionSlug, RegionAuctionsData>()

export interface AuctionsState {
    lastUpdate: number | null
}

export function createDefaultAuctionsState(): AuctionsState {
    const defaultState: AuctionsState = {
        lastUpdate: null,
    }

    return defaultState
}

export async function createAuctionsStore(filterStore: ReturnType<typeof useFilterStore>): Promise<Store<AuctionsState>> {
    const store = createStore<AuctionsState>({
        strict: DEFINE.IS_DEV,

        state: createDefaultAuctionsState,
        mutations,
        actions,
        getters,
    })

    const region = computed(() => filterStore.state.region)
    const fetchAuctions = async() => {
        if (!region.value) {
            return
        }

        await store.dispatch(AuctionsAction.LOAD_AUCTIONS, region.value)
    }

    watch(region, fetchAuctions)
    await fetchAuctions()

    return store
}

// ----------------------------------------------------------------------------
// TypeScript Helpers
// ----------------------------------------------------------------------------

type TypedStore = Omit<Store<AuctionsState>, 'commit' | 'dispatch' | 'getters'> & {
    commit<K extends keyof AuctionsMutations>(
        key: K,
        payload?: Parameters<AuctionsMutations[K]>[1],
        options?: CommitOptions
    ): ReturnType<AuctionsMutations[K]>
} & {
    dispatch<K extends keyof AuctionsActions>(
        key: K,
        payload?: Parameters<AuctionsActions[K]>[1],
        options?: DispatchOptions
    ): ReturnType<AuctionsActions[K]>
} & {
    getters: {
        [K in keyof AuctionsGetters]: ReturnType<AuctionsGetters[K]>
    }
}

export const auctionsInjectionKey: InjectionKey<TypedStore> = Symbol('Vuex (Auctions) InjectionKey')

export function useAuctionsStore(): TypedStore {
    return useStore(auctionsInjectionKey)
}
