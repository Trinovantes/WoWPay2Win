import { useRouter } from 'vue-router'
import { useFilterStore } from '.'
import { HydrationKey, loadStateFromLocalStorage, saveStateToLocalStorage } from '../Hydration'

export function useFilterSyncLocalStorage() {
    const filterStore = useFilterStore()
    const router = useRouter()

    const savedState = loadStateFromLocalStorage(HydrationKey.FILTER)
    const hasNoInitQuery = Object.keys(router.currentRoute.value.query).length === 0

    if (savedState && hasNoInitQuery) {
        filterStore.$patch(savedState)
    }

    filterStore.$subscribe((mutation, state) => {
        saveStateToLocalStorage(HydrationKey.FILTER, state)
    })
}
