import { useRouter } from 'vue-router'
import { loadStateFromLocalStorage, saveStateToLocalStorage } from '../Hydration.ts'
import { useFilterStore } from './useFilterStore.ts'

export function useFilterSyncLocalStorage() {
    const router = useRouter()
    const filterStore = useFilterStore()

    // Load state from localStorage if there's no init query
    const savedState = loadStateFromLocalStorage('__INITIAL_FILTER_STATE__')
    const hasNoInitQuery = Object.keys(router.currentRoute.value.query).length === 0
    if (savedState && hasNoInitQuery) {
        filterStore.$patch(savedState)
    }

    // Write changes to localStorage
    filterStore.$subscribe((mutation, state) => {
        saveStateToLocalStorage('__INITIAL_FILTER_STATE__', state)
    })
}
