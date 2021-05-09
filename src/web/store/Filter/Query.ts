import { Tertiary } from '@/common/BonusId'
import { GOLD_CAP, RegionSlug, Tier } from '@/common/Constants'
import { getIlvlRange, getTierBoeIds } from '@/common/utils'
import { createDefaultFilterState, FilterState, RegionFilter } from '.'
import { getRegionData } from '@/web/utils/GameData'
import _ from 'lodash'

// ----------------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------------

const MUST_HAVE_SOCKET_VALUE = '1'
const DELIMITER = ','

enum QueryFiltersField {
    tier = 'tier',
    region = 'region',
    realms = 'realms',
    boes = 'boes',
    ilvlRange = 'ilvlRange',
    maxBuyout = 'maxBuyout',
    mustHaveSocket = 'mustHaveSocket',
    tertiaries = 'tertiaries',
}

type QueryFilters = Partial<Record<QueryFiltersField, string>>

// ----------------------------------------------------------------------------
// Exports
// ----------------------------------------------------------------------------

export function importQuery(queryFilters: QueryFilters): FilterState {
    const importedFilters = createDefaultFilterState()

    if (queryFilters.region) {
        const validRegions = Object.values(RegionSlug)
        const region = queryFilters.region as RegionSlug
        if (validRegions.includes(region)) {
            importedFilters.region = region
        }
    }

    if (queryFilters.realms) {
        const validRealmIds = getValidRealmIds(importedFilters.region)
        const realms = importArray(queryFilters.realms).filter((realm) => validRealmIds.includes(realm))
        importedFilters.realms = new Set(realms)
    }

    if (queryFilters.tier) {
        const validTiers = Object.values(Tier)
        const tier = queryFilters.tier as Tier
        if (validTiers.includes(tier)) {
            importedFilters.tier = tier
        }
    }

    if (queryFilters.boes) {
        const validBoeIds = getTierBoeIds(importedFilters.tier)
        const boeIds = importArray(queryFilters.boes).filter((boeId) => validBoeIds.includes(boeId))
        importedFilters.boes = new Set(boeIds)
    }

    if (queryFilters.ilvlRange) {
        const [min, max] = queryFilters.ilvlRange.split(DELIMITER).map((ilvl) => parseInt(ilvl))
        if (!isNaN(min)) {
            importedFilters.ilvlRange.min = Math.max(min, importedFilters.ilvlRange.min)
        }
        if (!isNaN(max)) {
            importedFilters.ilvlRange.max = Math.min(max, importedFilters.ilvlRange.max)
        }
    }

    if (queryFilters.maxBuyout) {
        const maxBuyout = parseInt(queryFilters.maxBuyout)
        if (!isNaN(maxBuyout)) {
            importedFilters.maxBuyout = _.clamp(maxBuyout, 0, GOLD_CAP)
        }
    }

    if (queryFilters.mustHaveSocket) {
        importedFilters.mustHaveSocket = (queryFilters.mustHaveSocket === MUST_HAVE_SOCKET_VALUE)
    }

    if (queryFilters.tertiaries) {
        const validTertiaries = Object.values(Tertiary)
        const tertiaries = importArray(queryFilters.tertiaries).filter((tertiary) => validTertiaries.includes(tertiary))
        importedFilters.tertiaries = new Set(tertiaries)
    }

    return importedFilters
}

export function exportFilters(filterState: FilterState): QueryFilters {
    const queryFilters: QueryFilters = {}

    if (filterState.tier) {
        queryFilters.tier = filterState.tier
    }

    if (filterState.region) {
        queryFilters.region = filterState.region
    }

    if (filterState.realms.size > 0) {
        queryFilters.realms = exportSet(filterState.realms)
    }

    if (filterState.boes.size > 0) {
        queryFilters.boes = exportSet(filterState.boes)
    }

    if (!_.isEqual(filterState.ilvlRange, getIlvlRange(filterState.tier))) {
        queryFilters.ilvlRange = filterState.ilvlRange.min.toString() + DELIMITER + filterState.ilvlRange.max.toString()
    }

    if (filterState.maxBuyout < GOLD_CAP) {
        queryFilters.maxBuyout = filterState.maxBuyout.toString()
    }

    if (filterState.mustHaveSocket) {
        queryFilters.mustHaveSocket = MUST_HAVE_SOCKET_VALUE
    }

    if (filterState.tertiaries.size > 0) {
        queryFilters.tertiaries = exportSet(filterState.tertiaries)
    }

    return queryFilters
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function getValidRealmIds(region: RegionFilter): Array<number> {
    if (!region) {
        return []
    }

    const connectedRealms = getRegionData(region)?.connectedRealms
    if (!connectedRealms) {
        return []
    }

    return connectedRealms.flatMap((cr) => cr.realms.map((r) => r.id))
}

function exportSet(set: Set<number>): string {
    return [...set].sort().join(DELIMITER)
}

function importArray(setString: string): Array<number> {
    const idStrings = setString.split(',')
    const ids = idStrings
        .map((idString) => parseInt(idString))
        .filter((id) => !isNaN(id))

    return ids
}
