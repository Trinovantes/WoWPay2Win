import { defineStore } from 'pinia'
import { getRegionRealmIds } from '../../utils/getRegionRealmIds'
import { ALL_SECONDARIES, ALL_TERTIARIES, Secondary, Tertiary } from '@/common/ItemBonusId'
import { GOLD_CAP } from '@/common/Constants'
import { RegionSlug } from '@/common/RegionConfig'
import { BoeIlvlRange, Tier, getIlvlRange, getTierBoeIds } from '@/common/Boe'
import { defaultTier, tierConfigMap } from '../../utils/GameData'
import { ItemAuction } from '@/common/Cache'
import { getAuctionIlvl } from '../../utils/getAuctionIlvl'
import { auctionHasSocket } from '../../utils/auctionHasSocket'
import { getAuctionTertiary } from '../../utils/getAuctionTertiary'
import { getAuctionSecondary } from '../../utils/getAuctionSecondary'
import { computed, ref } from 'vue'

// ----------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------

export type RegionFilter = RegionSlug | null
export type RealmFilter = Set<number>
export type BoeFilter = Set<number>
export type TertiaryFilter = Set<Tertiary>
export type SecondaryFilter = Set<Secondary>

const MUST_HAVE_SOCKET_VALUE = '1'
const DELIMITER = ','

type QueryFiltersField =
    | 'tier'
    | 'region'
    | 'realms'
    | 'boes'
    | 'ilvlRange'
    | 'maxBuyout'
    | 'mustHaveSocket'
    | 'tertiaries'
    | 'secondaries'

type QueryFilters = Partial<Record<QueryFiltersField, string>>

// ----------------------------------------------------------------------------
// Store
// ----------------------------------------------------------------------------

export const useFilterStore = defineStore('Filter', () => {
    const tier = ref(defaultTier)
    const region = ref<RegionFilter>(null)
    const realms = ref<RealmFilter>(new Set())

    /**
     * We could alteratively save these item filters in a new obj and index them by tier i.e. { [key in Tier]: {...} }
     * However:
     * - It is impractical to save the entire store as an URL query
     * - There's probably a bigger use case for sharing URLs than people trying to compare items between multiple tiers
     * - Unlikely to have sellers/buyers for non-current tier items so it's also pointless to compare
     *
     * Therefore we will keep things simple and reset the tier-related item states whenever we change tiers
     */
    const boes = ref<BoeFilter>(new Set())
    const ilvlRange = ref<{ min: number; max: number }>(getIlvlRange(tierConfigMap, defaultTier))
    const maxBuyout = ref(GOLD_CAP)
    const mustHaveSocket = ref(false)
    const tertiaries = ref<TertiaryFilter>(new Set())
    const secondaries = ref<SecondaryFilter>(new Set())

    const reset = () => {
        tier.value = defaultTier
        region.value = null
        realms.value = new Set()

        boes.value = new Set()
        ilvlRange.value = getIlvlRange(tierConfigMap, defaultTier)
        maxBuyout.value = GOLD_CAP
        mustHaveSocket.value = false
        tertiaries.value = new Set()
        secondaries.value = new Set()
    }

    const currentTierName = computed(() => tierConfigMap.get(tier.value)?.name ?? `[INVALID TIER "${tier.value}"]`)
    const currentTierBoes = computed(() => tierConfigMap.get(tier.value)?.boes ?? [])
    const currentTierIlvlStep = computed(() => tierConfigMap.get(tier.value)?.ilvlStep)
    const currentTierIlvlRange = computed(() => tierConfigMap.get(tier.value)?.ilvlRange)

    const enableIlvlFilter = computed(() => {
        if (currentTierIlvlStep.value === undefined) {
            return false
        }

        if (currentTierIlvlRange.value === undefined) {
            return false
        }

        return currentTierIlvlStep.value > 0 && currentTierIlvlRange.value.min !== currentTierIlvlRange.value.max
    })
    const enableSocketFilter = computed(() => enableIlvlFilter.value)
    const enableTertiaryFilter = computed(() => enableIlvlFilter.value)
    const enableSecondaryFilter = computed(() => Boolean(tierConfigMap.get(tier.value)?.features?.enableSecondaryFilter))

    const changeTier = (newTier: Tier): void => {
        tier.value = newTier
        boes.value = new Set()
        ilvlRange.value = getIlvlRange(tierConfigMap, newTier)
    }

    const changeRegion = (newRegion: RegionFilter): void => {
        region.value = newRegion
        realms.value = new Set()
    }

    const shouldShowAuction = (auction: ItemAuction): boolean => {
        if (!boes.value.has(auction.itemId)) {
            return false
        }
        if (auction.buyout > maxBuyout.value) {
            return false
        }

        const isBoeGear = currentTierIlvlRange.value !== undefined
        if (isBoeGear) {
            const itemIlvl = getAuctionIlvl(auction)
            if (itemIlvl < ilvlRange.value.min || itemIlvl > ilvlRange.value.max) {
                return false
            }

            const itemHasSocket = auctionHasSocket(auction)
            if (mustHaveSocket.value && !itemHasSocket) {
                return false
            }

            const itemTertiary = getAuctionTertiary(auction)
            if (tertiaries.value.size > 0 && (itemTertiary === undefined || !tertiaries.value.has(itemTertiary))) {
                return false
            }

            const itemSecondary = getAuctionSecondary(auction)
            if (secondaries.value.size > 0 && !equal(secondaries.value, itemSecondary)) {
                return false
            }
        }

        return true
    }

    const exportToQuery = (): QueryFilters => {
        const queryFilters: QueryFilters = {}

        if (tier.value !== null) {
            queryFilters.tier = tier.value
        }

        if (region.value !== null) {
            queryFilters.region = region.value
        }

        if (realms.value.size > 0) {
            queryFilters.realms = exportNumSet(realms.value)
        }

        if (boes.value.size > 0) {
            queryFilters.boes = exportNumSet(boes.value)
        }

        if (!isIlvlRangeEqual(ilvlRange.value, getIlvlRange(tierConfigMap, tier.value))) {
            queryFilters.ilvlRange = ilvlRange.value.min.toString() + DELIMITER + ilvlRange.value.max.toString()
        }

        if (maxBuyout.value < GOLD_CAP) {
            queryFilters.maxBuyout = maxBuyout.value.toString()
        }

        if (mustHaveSocket.value) {
            queryFilters.mustHaveSocket = MUST_HAVE_SOCKET_VALUE
        }

        if (tertiaries.value.size > 0) {
            queryFilters.tertiaries = exportNumSet(tertiaries.value)
        }

        if (secondaries.value.size > 0) {
            queryFilters.secondaries = exportNumSet(secondaries.value)
        }

        return queryFilters
    }

    const importFromQuery = (queryFilters: QueryFilters): void => {
        if (queryFilters.region) {
            const validRegions: Array<RegionSlug> = ['us', 'eu', 'tw', 'kr']
            const importedRegion = queryFilters.region as RegionSlug
            if (validRegions.includes(importedRegion)) {
                changeRegion(importedRegion)
            }
        }

        if (queryFilters.realms) {
            const validRealmIds = getRegionRealmIds(region.value)
            const importedRealms = importNumArray(queryFilters.realms, validRealmIds)
            realms.value = new Set(importedRealms)
        }

        if (queryFilters.tier) {
            const validTiers = [...tierConfigMap.keys()]
            const importedTier = queryFilters.tier as Tier
            if (validTiers.includes(importedTier)) {
                changeTier(importedTier)
            }
        }

        if (queryFilters.boes) {
            const validBoeIds = getTierBoeIds(tierConfigMap, tier.value)
            const importedBoes = importNumArray(queryFilters.boes, validBoeIds)
            boes.value = new Set(importedBoes)
        }

        if (queryFilters.ilvlRange) {
            const [min, max] = queryFilters.ilvlRange.split(DELIMITER).map((ilvl) => parseInt(ilvl))
            const tierIlvls = getIlvlRange(tierConfigMap, tier.value)

            if (!isNaN(min)) {
                ilvlRange.value.min = Math.max(min, tierIlvls.min)
            }
            if (!isNaN(max)) {
                ilvlRange.value.max = Math.min(max, tierIlvls.max)
            }
        }

        if (queryFilters.maxBuyout) {
            const importedMaxBuyout = parseInt(queryFilters.maxBuyout)
            if (!isNaN(importedMaxBuyout)) {
                maxBuyout.value = clamp(importedMaxBuyout, 0, GOLD_CAP)
            }
        }

        if (queryFilters.mustHaveSocket) {
            mustHaveSocket.value = (queryFilters.mustHaveSocket === MUST_HAVE_SOCKET_VALUE)
        }

        if (queryFilters.tertiaries) {
            const validTertiaries = ALL_TERTIARIES.map((tertiary) => tertiary.bonusId)
            const importedTertiaries = importNumArray<Tertiary>(queryFilters.tertiaries, validTertiaries)
            tertiaries.value = new Set(importedTertiaries)
        }

        if (queryFilters.secondaries) {
            const validSecondaries = ALL_SECONDARIES.map((secondary) => secondary.key)
            const importedSecondaries = importNumArray<Secondary>(queryFilters.secondaries, validSecondaries)
            secondaries.value = new Set(importedSecondaries)
        }
    }

    return {
        tier,
        region,
        realms,

        boes,
        ilvlRange,
        maxBuyout,
        mustHaveSocket,
        tertiaries,
        secondaries,

        currentTierName,
        currentTierBoes,
        currentTierIlvlRange,
        currentTierIlvlStep,

        enableIlvlFilter,
        enableSocketFilter,
        enableTertiaryFilter,
        enableSecondaryFilter,

        changeRegion,
        changeTier,
        shouldShowAuction,
        importFromQuery,
        exportToQuery,

        reset,
    }
})

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function isIlvlRangeEqual(a: BoeIlvlRange, b: BoeIlvlRange): boolean {
    return a.max === b.max && a.min === b.min
}

function clamp(val: number, min: number, max: number): number {
    val = Math.min(val, max)
    val = Math.max(val, min)
    return val
}

function exportNumSet(set: Set<number>): string {
    return [...set].sort((a, b) => a - b).join(DELIMITER)
}

function importNumArray<T extends number = number>(setString: string, validValues: ReadonlyArray<number>): Array<T> {
    const valueStrings = setString.split(',')
    const values = valueStrings
        .map((value) => parseInt(value))
        .filter((value) => !isNaN(value))
        .filter((value) => validValues.includes(value))

    return values as Array<T>
}

function equal<T>(a: Set<T>, b: Array<T>): boolean {
    if (a.size !== b.length) {
        return false
    }

    for (const bItem of b) {
        if (!a.has(bItem)) {
            return false
        }
    }

    return true
}
