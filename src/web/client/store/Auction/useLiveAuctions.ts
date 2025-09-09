import { computed, watch } from 'vue'
import { useFilterStore } from '../Filter/useFilterStore.ts'
import { useAuctionStore } from './useAuctionStore.ts'

export function useLiveAuctions() {
    const auctionsStore = useAuctionStore()
    const filterStore = useFilterStore()

    // Load auctions whenever filterStore.region changes
    const region = computed(() => filterStore.region)
    const fetchAuctions = async () => {
        if (region.value === null) {
            return
        }

        await auctionsStore.loadAuctions(region.value)
    }

    watch(region, fetchAuctions, { immediate: true })
}
