import { defineStore } from 'pinia'
import { getRegionRealmIds } from '../../utils/getRegionRealmIds.ts'
import { defaultTier, tierConfigMap } from '../../utils/GameData.ts'
import { getAuctionHasSocket } from '../../utils/getAuctionHasSocket.ts'
import { getAuctionTertiary } from '../../utils/getAuctionTertiary.ts'
import { getAuctionSecondary } from '../../utils/getAuctionSecondary.ts'
import { computed, ref } from 'vue'
import { type Tier, getTierBoeIds } from '../../../../common/Boe.ts'
import type { ItemAuction } from '../../../../common/Cache.ts'
import { GOLD_CAP } from '../../../../common/Constants.ts'
import { type Tertiary, type Secondary, ALL_TERTIARIES, ALL_SECONDARIES, type Difficulty, ALL_DIFFICULTIES } from '../../../../common/ItemBonusId.ts'
import type { RegionSlug } from '../../../../common/RegionConfig.ts'
import { getAuctionDifficulty } from '../../utils/getAuctionDifficulty.ts'

// ----------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------

export type RegionFilter = RegionSlug | null
export type RealmFilter = Set<number>
export type BoeFilter = Set<number>
export type DifficultyFilter = Set<Difficulty>
export type TertiaryFilter = Set<Tertiary>
export type SecondaryFilter = Set<Secondary>

const MUST_HAVE_SOCKET_VALUE = '1'
const DELIMITER = ','

type QueryFiltersField =
    | 'tier'
    | 'region'
    | 'realms'
    | 'boes'
    | 'difficulty'
    | 'maxBuyout'
    | 'mustHaveSocket'
    | 'tertiaries'
    | 'secondaries'

type QueryFilters = Partial<Record<QueryFiltersField, string>>

// ----------------------------------------------------------------------------
// Store
// ----------------------------------------------------------------------------

export const useFilterStore = defineStore('Filter', () => {
    const region = ref<RegionFilter>(null)
    const realms = ref<RealmFilter>(new Set())

    /**
     * We could alteratively save these item filters in a map and index them by tier i.e. { [key in Tier]: {...} }
     * However:
     * - It is impractical to save the entire store as an URL query
     * - There's probably a bigger use case for sharing URLs than people trying to compare items between multiple tiers
     * - Unlikely to have sellers/buyers for non-current tier items so it's also pointless to compare
     *
     * Therefore we will keep things simple and reset the tier-related item states whenever we change tiers
     */
    const tier = ref(defaultTier)
    const boes = ref<BoeFilter>(new Set())
    const maxBuyout = ref(GOLD_CAP)
    const mustHaveSocket = ref(false)
    const difficulties = ref<DifficultyFilter>(new Set())
    const tertiaries = ref<TertiaryFilter>(new Set())
    const secondaries = ref<SecondaryFilter>(new Set())

    const changeTier = (newTier: Tier): void => {
        tier.value = newTier
        boes.value = new Set()
        maxBuyout.value = GOLD_CAP
        mustHaveSocket.value = false
        difficulties.value = new Set()
        tertiaries.value = new Set()
        secondaries.value = new Set()
    }

    const reset = () => {
        region.value = null
        realms.value = new Set()
        changeTier(defaultTier)
    }

    const currentTierName = computed(() => tierConfigMap.get(tier.value)?.name ?? `[INVALID TIER "${tier.value}"]`)
    const currentTierBoes = computed(() => tierConfigMap.get(tier.value)?.boes ?? [])

    const enableDifficultyFilter = computed(() => Boolean(tierConfigMap.get(tier.value)?.features?.enableDifficultyFilter))
    const enableSocketFilter = computed(() => Boolean(tierConfigMap.get(tier.value)?.features?.enableSocketFilter))
    const enableTertiaryFilter = computed(() => Boolean(tierConfigMap.get(tier.value)?.features?.enableTertiaryFilter))
    const enableSecondaryFilter = computed(() => Boolean(tierConfigMap.get(tier.value)?.features?.enableSecondaryFilter))

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

        if (enableDifficultyFilter.value) {
            const itemDifficulty = getAuctionDifficulty(auction)
            if (difficulties.value.size > 0 && (itemDifficulty === undefined || !difficulties.value.has(itemDifficulty))) {
                return false
            }
        }

        if (enableSocketFilter.value) {
            const itemHasSocket = getAuctionHasSocket(auction)
            if (mustHaveSocket.value && !itemHasSocket) {
                return false
            }
        }

        if (enableTertiaryFilter.value) {
            const itemTertiary = getAuctionTertiary(auction)
            if (tertiaries.value.size > 0 && (itemTertiary === undefined || !tertiaries.value.has(itemTertiary))) {
                return false
            }
        }

        if (enableSecondaryFilter.value) {
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

        if (maxBuyout.value < GOLD_CAP) {
            queryFilters.maxBuyout = maxBuyout.value.toString()
        }

        if (mustHaveSocket.value) {
            queryFilters.mustHaveSocket = MUST_HAVE_SOCKET_VALUE
        }

        if (difficulties.value.size > 0) {
            queryFilters.difficulty = exportNumSet(difficulties.value)
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

        if (queryFilters.maxBuyout) {
            const importedMaxBuyout = parseInt(queryFilters.maxBuyout)
            if (!isNaN(importedMaxBuyout)) {
                maxBuyout.value = clamp(importedMaxBuyout, 0, GOLD_CAP)
            }
        }

        if (queryFilters.mustHaveSocket) {
            mustHaveSocket.value = (queryFilters.mustHaveSocket === MUST_HAVE_SOCKET_VALUE)
        }

        if (queryFilters.difficulty) {
            const validDifficulties = ALL_DIFFICULTIES.map((difficulty) => difficulty.key)
            const importedDifficulties = importNumArray<Difficulty>(queryFilters.difficulty, validDifficulties)
            difficulties.value = new Set(importedDifficulties)
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
        region,
        realms,

        tier,
        boes,
        maxBuyout,
        mustHaveSocket,
        difficulties,
        tertiaries,
        secondaries,

        currentTierName,
        currentTierBoes,

        enableDifficultyFilter,
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

function clamp(val: number, min: number, max: number): number {
    val = Math.min(val, max)
    val = Math.max(val, min)
    return val
}

function exportNumSet(set: Set<number>): string {
    return [...set].toSorted((a, b) => a - b).join(DELIMITER)
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
