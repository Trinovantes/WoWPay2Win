import { computed, onMounted, watch } from 'vue'
import { useAuctionsStore } from '.'
import { useFilterStore } from '../Filter'

export function useLiveAuctions() {
    const auctionsStore = useAuctionsStore()
    const filterStore = useFilterStore()

    // Load auctions whenever filterStore.region changes
    const region = computed(() => filterStore.region)
    const fetchAuctions = async() => {
        if (!region.value) {
            return
        }

        await auctionsStore.loadAuctions(region.value)
    }

    watch(region, async() => await fetchAuctions())
    onMounted(async() => await fetchAuctions())
}
