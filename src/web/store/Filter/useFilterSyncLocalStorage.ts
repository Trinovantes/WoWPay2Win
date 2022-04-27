import { useRouter } from 'vue-router'
import { HydrationKey, loadStateFromLocalStorage, saveStateToLocalStorage } from '../Hydration'
import { useFilterStore } from '.'

export function useFilterSyncLocalStorage() {
    const router = useRouter()
    const filterStore = useFilterStore()

    // Load state from localStorage if there's no init query
    const savedState = loadStateFromLocalStorage(HydrationKey.FILTER)
    const hasNoInitQuery = Object.keys(router.currentRoute.value.query).length === 0
    if (savedState && hasNoInitQuery) {
        filterStore.$patch(savedState)
    }

    // Write changes to localStorage
    filterStore.$subscribe((mutation, state) => {
        saveStateToLocalStorage(HydrationKey.FILTER, state)
    })
}
