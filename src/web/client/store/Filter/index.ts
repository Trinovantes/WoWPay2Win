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

// ----------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------

export type RegionFilter = RegionSlug | null
export type RealmFilter = Set<number>
export type BoeFilter = Set<number>
export type TertiaryFilter = Set<Tertiary>
export type SecondaryFilter = Set<Secondary>

export type FilterState = {
    tier: Tier
    region: RegionFilter
    realms: RealmFilter
    boes: BoeFilter
    ilvlRange: {
        min: number
        max: number
    }
    maxBuyout: number
    mustHaveSocket: boolean
    tertiaries: TertiaryFilter
    secondaries: SecondaryFilter
}

export function createDefaultFilterState(): FilterState {
    const defaultState: FilterState = {
        tier: defaultTier,
        region: null,
        realms: new Set(),

        /**
         * We could alteratively save these item filters in a new obj and index them by tier i.e. { [key in Tier]: {...} }
         * However:
         * - It is impractical to save the entire store as an URL query
         * - There's probably a bigger use case for sharing URLs than people trying to compare items between multiple tiers
         * - Unlikely to have sellers/buyers for non-current tier items so it's also pointless to compare
         *
         * Therefore we will keep things simple and reset the tier-related item states whenever we change tiers
         */
        boes: new Set(),
        ilvlRange: getIlvlRange(tierConfigMap, defaultTier),
        maxBuyout: GOLD_CAP,
        mustHaveSocket: false,
        tertiaries: new Set(),
        secondaries: new Set(),
    }

    return defaultState
}

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

export const useFilterStore = defineStore('Filter', {
    state: createDefaultFilterState,

    getters: {
        currentTierName: (state) => {
            return tierConfigMap.get(state.tier)?.name ?? `[INVALID TIER "${state.tier}"]`
        },

        currentTierBoes: (state) => {
            return tierConfigMap.get(state.tier)?.boes ?? []
        },

        currentTierIlvlStep: (state) => {
            return tierConfigMap.get(state.tier)?.ilvlStep
        },

        currentTierIlvlRange: (state) => {
            return tierConfigMap.get(state.tier)?.ilvlRange
        },

        enableIlvlFilter(): boolean {
            const ilvlStep = this.currentTierIlvlStep
            if (ilvlStep === undefined) {
                return false
            }

            const ilvlRange = this.currentTierIlvlRange
            if (ilvlRange === undefined) {
                return false
            }

            return ilvlStep > 0 && ilvlRange.min !== ilvlRange.max
        },

        enableSocketFilter(): boolean {
            return this.enableIlvlFilter
        },

        enableTertiaryFilter(): boolean {
            return this.enableIlvlFilter
        },

        enableSecondaryFilter(): boolean {
            return Boolean(tierConfigMap.get(this.tier)?.features?.enableSecondaryFilter)
        },
    },

    actions: {
        changeTier(tier: Tier) {
            this.tier = tier
            this.boes = new Set()
            this.ilvlRange = getIlvlRange(tierConfigMap, tier)
        },

        changeRegion(region: RegionFilter) {
            this.region = region
            this.realms = new Set()
        },

        showAuction(auction: ItemAuction): boolean {
            if (!this.boes.has(auction.itemId)) {
                return false
            }
            if (auction.buyout > this.maxBuyout) {
                return false
            }

            const isBoeGear = this.currentTierIlvlRange !== undefined
            if (isBoeGear) {
                const itemIlvl = getAuctionIlvl(auction)
                if (itemIlvl < this.ilvlRange.min || itemIlvl > this.ilvlRange.max) {
                    return false
                }

                const itemHasSocket = auctionHasSocket(auction)
                if (this.mustHaveSocket && !itemHasSocket) {
                    return false
                }

                const itemTertiary = getAuctionTertiary(auction)
                if (this.tertiaries.size > 0 && (itemTertiary === undefined || !this.tertiaries.has(itemTertiary))) {
                    return false
                }

                const itemSecondary = getAuctionSecondary(auction)
                if (this.secondaries.size > 0 && !equal(this.secondaries, itemSecondary)) {
                    return false
                }
            }

            return true
        },

        exportToQuery(): QueryFilters {
            const queryFilters: QueryFilters = {}

            if (this.tier !== null) {
                queryFilters.tier = this.tier
            }

            if (this.region !== null) {
                queryFilters.region = this.region
            }

            if (this.realms.size > 0) {
                queryFilters.realms = exportNumSet(this.realms)
            }

            if (this.boes.size > 0) {
                queryFilters.boes = exportNumSet(this.boes)
            }

            if (!isIlvlRangeEqual(this.ilvlRange, getIlvlRange(tierConfigMap, this.tier))) {
                queryFilters.ilvlRange = this.ilvlRange.min.toString() + DELIMITER + this.ilvlRange.max.toString()
            }

            if (this.maxBuyout < GOLD_CAP) {
                queryFilters.maxBuyout = this.maxBuyout.toString()
            }

            if (this.mustHaveSocket) {
                queryFilters.mustHaveSocket = MUST_HAVE_SOCKET_VALUE
            }

            if (this.tertiaries.size > 0) {
                queryFilters.tertiaries = exportNumSet(this.tertiaries)
            }

            if (this.secondaries.size > 0) {
                queryFilters.secondaries = exportNumSet(this.secondaries)
            }

            return queryFilters
        },

        importFromQuery(queryFilters: QueryFilters) {
            if (queryFilters.region) {
                const validRegions: Array<RegionSlug> = ['us', 'eu', 'tw', 'kr']
                const region = queryFilters.region as RegionSlug
                if (validRegions.includes(region)) {
                    this.changeRegion(region)
                }
            }

            if (queryFilters.realms) {
                const validRealmIds = getRegionRealmIds(this.region)
                const realms = importNumArray(queryFilters.realms, validRealmIds)
                this.realms = new Set(realms)
            }

            if (queryFilters.tier) {
                const validTiers = [...tierConfigMap.keys()]
                const tier = queryFilters.tier as Tier
                if (validTiers.includes(tier)) {
                    this.changeTier(tier)
                }
            }

            if (queryFilters.boes) {
                const validBoeIds = getTierBoeIds(tierConfigMap, this.tier)
                const boeIds = importNumArray(queryFilters.boes, validBoeIds)
                this.boes = new Set(boeIds)
            }

            if (queryFilters.ilvlRange) {
                const [min, max] = queryFilters.ilvlRange.split(DELIMITER).map((ilvl) => parseInt(ilvl))
                const tierIlvls = getIlvlRange(tierConfigMap, this.tier)

                if (!isNaN(min)) {
                    this.ilvlRange.min = Math.max(min, tierIlvls.min)
                }
                if (!isNaN(max)) {
                    this.ilvlRange.max = Math.min(max, tierIlvls.max)
                }
            }

            if (queryFilters.maxBuyout) {
                const maxBuyout = parseInt(queryFilters.maxBuyout)
                if (!isNaN(maxBuyout)) {
                    this.maxBuyout = clamp(maxBuyout, 0, GOLD_CAP)
                }
            }

            if (queryFilters.mustHaveSocket) {
                this.mustHaveSocket = (queryFilters.mustHaveSocket === MUST_HAVE_SOCKET_VALUE)
            }

            if (queryFilters.tertiaries) {
                const validTertiaries = ALL_TERTIARIES.map((tertiary) => tertiary.bonusId)
                const tertiaries = importNumArray<Tertiary>(queryFilters.tertiaries, validTertiaries)
                this.tertiaries = new Set(tertiaries)
            }

            if (queryFilters.secondaries) {
                const validSecondaries = ALL_SECONDARIES.map((secondary) => secondary.key)
                const secondaries = importNumArray<Secondary>(queryFilters.secondaries, validSecondaries)
                this.secondaries = new Set(secondaries)
            }
        },
    },
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
