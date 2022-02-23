import { computed, onBeforeMount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFilterStore } from '.'

export function useFilterSyncQuery() {
    const filterStore = useFilterStore()
    const router = useRouter()
    const routeQuery = computed(() => router.currentRoute.value.query)

    // Avoid infinite loop due to one handler causing changes that will trigger the other handler
    let isProcessing = false

    const exportQuery = async() => {
        if (isProcessing) {
            return
        }

        isProcessing = true
        const exportedQuery = filterStore.exportToQuery()
        await router.push({ query: exportedQuery })
        isProcessing = false
    }

    const importQuery = () => {
        if (isProcessing) {
            return
        }

        isProcessing = true
        filterStore.importFromQuery(routeQuery.value)
        isProcessing = false
    }

    // Whenever the url changes, we import the query into the state
    watch(routeQuery, () => importQuery(), { deep: true })

    // Whenever the state changes, we export the query into the url
    filterStore.$subscribe(() => { void exportQuery() })

    // This runs once on page load: load url query (and filtering out invalid params) then save result back to url
    // Use onBeforeMount hook instead of onMounted so that this executes before children components' onMounted hooks (that may modify state)
    onBeforeMount(async() => {
        const hasInitQuery = Object.keys(routeQuery.value).length > 0
        if (hasInitQuery) {
            isProcessing = true
            filterStore.$reset()
            isProcessing = false
        }

        importQuery()
        await exportQuery()
    })
}
