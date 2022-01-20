import { computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFilterStore } from '.'

export function useSyncFilterQuery() {
    const filterStore = useFilterStore()
    const router = useRouter()
    const routeQuery = computed(() => router.currentRoute.value.query)

    // Avoid infinite loop due to one handler causing changes that will trigger the other handler
    let isImporting = false

    const exportQuery = () => {
        if (isImporting) {
            return
        }

        const exportedQuery = filterStore.exportedQuery
        void router.push({ query: exportedQuery })
    }

    const importQuery = () => {
        isImporting = true
        filterStore.importFromQuery(routeQuery.value)
        isImporting = false
    }

    // Whenever the url changes, we import the query into the state
    watch(routeQuery, () => importQuery(), { deep: true })

    // Whenever the state changes, we export the query into the url
    filterStore.$subscribe(() => exportQuery())

    // This runs once on page load: load url query (and filtering out invalid params) then save result back to url
    onMounted(() => {
        importQuery()
        exportQuery()
    })
}
