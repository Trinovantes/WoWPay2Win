import { computed, onMounted, watch } from 'vue'
import { useFilterStore } from '../Filter'
import { useAuctionsStore } from '.'

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
