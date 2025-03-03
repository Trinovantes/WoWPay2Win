import { defineStore } from 'pinia'
import { getRegionRealmIds } from '../../utils/getRegionRealmIds'
import { ALL_TERTIARIES, Tertiary } from '@/common/BonusId'
import { GOLD_CAP } from '@/common/Constants'
import { RegionSlug } from '@/common/RegionConfig'
import { BoeIlvlRange, Tier, defaultTier, getIlvlRange, getTierBoeIds, tierConfigs } from '@/common/Boe'

// ----------------------------------------------------------------------------
// State
// ----------------------------------------------------------------------------

export type RegionFilter = RegionSlug | null
export type RealmFilter = Set<number>
export type BoeFilter = Set<number>
export type TertiaryFilter = Set<Tertiary>

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
        ilvlRange: getIlvlRange(defaultTier),
        maxBuyout: GOLD_CAP,
        mustHaveSocket: false,
        tertiaries: new Set(),
    }

    return defaultState
}

const MUST_HAVE_SOCKET_VALUE = '1'
const DELIMITER = ','

type QueryFiltersField =
    'tier' |
    'region' |
    'realms' |
    'boes' |
    'ilvlRange' |
    'maxBuyout' |
    'mustHaveSocket' |
    'tertiaries'

type QueryFilters = Partial<Record<QueryFiltersField, string>>

// ----------------------------------------------------------------------------
// Store
// ----------------------------------------------------------------------------

export const useFilterStore = defineStore('Filter', {
    state: createDefaultFilterState,

    getters: {
        currentTierName: (state) => {
            return tierConfigs.get(state.tier)?.name ?? `[INVALID TIER "${state.tier}"]`
        },

        currentTierBoes: (state) => {
            return tierConfigs.get(state.tier)?.boes ?? []
        },

        currentTierIlvlStep: (state) => {
            return tierConfigs.get(state.tier)?.ilvlStep
        },

        currentTierIlvlRange: (state) => {
            return tierConfigs.get(state.tier)?.ilvlRange
        },
    },

    actions: {
        changeTier(tier: Tier) {
            this.tier = tier
            this.boes = new Set()
            this.ilvlRange = getIlvlRange(tier)
        },

        changeRegion(region: RegionFilter) {
            this.region = region
            this.realms = new Set()
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

            if (!isIlvlRangeEqual(this.ilvlRange, getIlvlRange(this.tier))) {
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
                const validTiers = [...tierConfigs.keys()]
                const tier = queryFilters.tier as Tier
                if (validTiers.includes(tier)) {
                    this.changeTier(tier)
                }
            }

            if (queryFilters.boes) {
                const validBoeIds = getTierBoeIds(this.tier)
                const boeIds = importNumArray(queryFilters.boes, validBoeIds)
                this.boes = new Set(boeIds)
            }

            if (queryFilters.ilvlRange) {
                const [min, max] = queryFilters.ilvlRange.split(DELIMITER).map((ilvl) => parseInt(ilvl))
                const tierIlvls = getIlvlRange(this.tier)

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

function importNumArray<T extends number = number>(setString: string, validValues: Array<number>): Array<T> {
    const numStrings = setString.split(',')
    const nums = numStrings
        .map((s) => parseInt(s))
        .filter((num) => !isNaN(num))
        .filter((num) => validValues.includes(num))

    return nums as Array<T>
}
