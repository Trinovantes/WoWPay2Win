<template>
    <div id="app">
        <router-view
            v-if="ready"
            class="full-width full-height"
        />
        <q-spinner
            v-else
            size="10em"
        />
    </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { Watch } from 'vue-property-decorator'

import _ from 'lodash'

import Constants, { getDefaultTier, getIlvlRange, getTierBoeIds, RegionSlug, Tier } from '@common/Constants'
import { createDefaultState, SavedFilters } from '@store/AppStore'
import { AuctionDataAccessor } from '@views/mixins/AuctionDataAccessor'
import { Tertiary } from '@common/Bonuses'

const MUST_HAVE_SOCKET_VALUE = '1'
const DELIMITER = ','

@Component({
    components: {
        Auctions: () => import('@views/pages/AuctionsPage.vue'),
    },
})
export default class App extends mixins(AuctionDataAccessor) {
    ready = false
    pendingQuery = false

    created(): void {
        document.title = Constants.APP_NAME
        this.importFilters(this.$route.query)
        this.ready = true
    }

    @Watch('$route.query')
    updateState(newFilters: SavedFilters, oldFilters: SavedFilters): void {
        // Skip query changes that we initiated
        // This watcher only cares about changes that the user manually made
        if (this.pendingQuery) {
            return
        }

        if (_.isEqual(newFilters, oldFilters)) {
            return
        }

        this.importFilters(newFilters)
    }

    @Watch('region')
    @Watch('realms')
    @Watch('tier')
    @Watch('boes')
    @Watch('ilvlRange')
    @Watch('maxBuyout')
    @Watch('mustHaveSocket')
    @Watch('tertiaries')
    async updateQuery(): Promise<void> {
        const newFilters = this.exportFilters()
        const oldFilters = this.$router.currentRoute.query

        if (_.isEqual(newFilters, oldFilters)) {
            return
        }

        this.pendingQuery = true
        await this.$router.replace({
            query: newFilters,
        })
        this.pendingQuery = false
    }

    private importFilters(savedFilters: SavedFilters): void {
        const importedState = createDefaultState()

        if (savedFilters.region) {
            const validRegions = Object.values(RegionSlug)
            const region = savedFilters.region as RegionSlug
            if (validRegions.includes(region)) {
                importedState.region = region
            }
        }
        this.changeRegion(importedState.region)

        if (savedFilters.realms) {
            this.fetchRealms()
            const validRealms = Object.values(this.regionRealms).map((realm) => realm.id)
            const realms = importArray(savedFilters.realms).filter((realm) => {
                return validRealms.includes(realm)
            })

            importedState.realms = new Set(realms)
        }
        this.changeRealms(importedState.realms)

        if (savedFilters.tier) {
            const validTiers = Object.values(Tier)
            const tier = savedFilters.tier as Tier
            if (validTiers.includes(tier)) {
                importedState.tier = tier
            }
        }
        if (importedState.tier === null) {
            importedState.tier = getDefaultTier()
        }
        this.changeTier(importedState.tier)

        if (savedFilters.boes) {
            const validBoeIds = getTierBoeIds(importedState.tier)
            const boeIds = importArray(savedFilters.boes).filter((boeId) => {
                return validBoeIds.includes(boeId)
            })
            importedState.boes = new Set(boeIds)
        }
        this.changeBoes(importedState.boes)

        const defaultIlvlRange = getIlvlRange(importedState.tier)
        importedState.ilvlRange = defaultIlvlRange
        if (savedFilters.ilvlRange) {
            const [min, max] = savedFilters.ilvlRange.split(DELIMITER).map((ilvl) => parseInt(ilvl))
            importedState.ilvlRange = {
                min: isNaN(min) ? defaultIlvlRange.min : Math.max(min, defaultIlvlRange.min),
                max: isNaN(max) ? defaultIlvlRange.max : Math.min(max, defaultIlvlRange.max),
            }
        }
        this.changeIlvlRange(importedState.ilvlRange)

        if (savedFilters.maxBuyout) {
            const maxBuyout = parseInt(savedFilters.maxBuyout)
            if (!isNaN(maxBuyout)) {
                importedState.maxBuyout = _.clamp(maxBuyout, 0, Constants.GOLD_CAP)
            }
        }
        this.changeMaxBuyout(importedState.maxBuyout)

        if (savedFilters.mustHaveSocket) {
            importedState.mustHaveSocket = (savedFilters.mustHaveSocket === MUST_HAVE_SOCKET_VALUE)
        }
        this.changeMustHaveSocket(importedState.mustHaveSocket)

        if (savedFilters.tertiaries) {
            const validTertiaries = Object.values(Tertiary)
            const tertiaries = importArray(savedFilters.tertiaries).filter((tertiary) => {
                return validTertiaries.includes(tertiary)
            })
            importedState.tertiaries = new Set(tertiaries)
        }
        this.changeTertiaries(importedState.tertiaries)
    }

    private exportFilters(): SavedFilters {
        const savedFilters: SavedFilters = {}

        if (this.region) {
            savedFilters.region = this.region
        }
        if (this.realms.size > 0) {
            savedFilters.realms = exportSet(this.realms)
        }

        if (this.tier) {
            savedFilters.tier = this.tier.toString()
        }

        if (this.boes.size > 0) {
            savedFilters.boes = exportSet(this.boes)
        }
        if (!_.isEqual(this.ilvlRange, getIlvlRange(this.tier))) {
            savedFilters.ilvlRange = `${this.ilvlRange.min}${DELIMITER}${this.ilvlRange.max}`
        }
        if (this.maxBuyout < Constants.GOLD_CAP) {
            savedFilters.maxBuyout = this.maxBuyout.toString()
        }
        if (this.mustHaveSocket) {
            savedFilters.mustHaveSocket = MUST_HAVE_SOCKET_VALUE
        }
        if (this.tertiaries.size > 0) {
            savedFilters.tertiaries = exportSet(this.tertiaries)
        }

        return savedFilters
    }
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
</script>

<style lang="scss">
html,
body,
#app{
    min-height: 100vh;
}

#app{
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
