import { defineStore } from 'pinia'
import { getConnectedRealmIds } from '../../utils/getConnectedRealmIds'
import { useFilterStore } from '../Filter'
import { ItemAuction, RegionAuctions } from '@/common/Cache'
import { RegionSlug } from '@/common/RegionConfig'
import { formatDistance } from 'date-fns'
import { computed, ref } from 'vue'

// ----------------------------------------------------------------------------
// Store
// ----------------------------------------------------------------------------

export type Auctions = Array<ItemAuction>

export const useAuctionsStore = defineStore('Auctions', () => {
    const filterStore = useFilterStore()

    const auctions = ref(new Map<RegionSlug, RegionAuctions>())
    const loadAuctions = async(regionSlug: RegionSlug): Promise<void> => {
        const regionAuctions = auctions.value.get(regionSlug)
        const regionExpired = (Date.now() - (regionAuctions?.lastUpdate ?? 0)) > (3600 * 1000) // Expire after 1 hour
        if (!regionExpired) {
            return
        }

        const auctionsFile = `/data/auctions-${regionSlug}.json`
        const response = await fetch(auctionsFile)
        const loadedAuctions = await response.json() as RegionAuctions
        auctions.value.set(regionSlug, loadedAuctions)
    }

    const filteredAuctions = computed<Auctions>(() => {
        if (filterStore.region === null) {
            return []
        }

        // If the user filtered by realms, we need to find their corresponding parent crIds
        const connectedRealms = getConnectedRealmIds(filterStore.region, filterStore.realms)

        // Get and filter auctions
        const regionAuctions = auctions.value.get(filterStore.region)?.auctions ?? []
        return regionAuctions.filter((auction) => {
            if (!filterStore.shouldShowAuction(auction)) {
                return false
            }
            if (connectedRealms.size > 0 && !connectedRealms.has(auction.crId)) {
                return false
            }

            return true
        })
    })
    const tokenPrice = computed<number | undefined>(() => {
        if (filterStore.region === null) {
            return
        }

        const tokenPrice = auctions.value.get(filterStore.region)?.tokenPrice
        if (tokenPrice === undefined) {
            return
        }

        return tokenPrice
    })

    const lastUpdateIso = computed<string>(() => {
        if (filterStore.region === null) {
            return ''
        }

        const lastUpdate = auctions.value.get(filterStore.region)?.lastUpdate
        if (lastUpdate === undefined) {
            return ''
        }

        return new Date(lastUpdate).toISOString()
    })
    const lastUpdateFull = computed<string>(() => {
        if (filterStore.region === null) {
            return ''
        }

        const lastUpdate = auctions.value.get(filterStore.region)?.lastUpdate
        if (lastUpdate === undefined) {
            return ''
        }

        return new Date(lastUpdate).toString()
    })
    const lastUpdateFromNow = computed<string>(() => {
        if (filterStore.region === null) {
            return ''
        }

        const lastUpdate = auctions.value.get(filterStore.region)?.lastUpdate
        if (lastUpdate === undefined) {
            return ''
        }

        return formatDistance(lastUpdate, new Date(), { addSuffix: true })
    })

    return {
        loadAuctions,
        filteredAuctions,
        tokenPrice,

        lastUpdateIso,
        lastUpdateFull,
        lastUpdateFromNow,
    }
})
