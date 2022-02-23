import { useFilterStore } from '.'
import { HydrationKey, loadStateFromLocalStorage, saveStateToLocalStorage } from '../Hydration'

export function useFilterSyncLocalStorage() {
    const filterStore = useFilterStore()

    const savedState = loadStateFromLocalStorage(HydrationKey.FILTER)
    if (savedState) {
        filterStore.$patch(savedState)
    }

    filterStore.$subscribe((mutation, state) => {
        saveStateToLocalStorage(HydrationKey.FILTER, state)
    })
}
