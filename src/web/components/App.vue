<template>
    <div class="app">
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
import Component from 'vue-class-component'
import VuexComponent from '@components/base/VuexComponent'
import { Watch } from 'vue-property-decorator'

import _ from 'lodash'

import Constants, { getDefaultTier, getIlvlRange, getTierBoeIds, Region, Tertiary, Tier } from '@common/Constants'
import { SavedFilters } from '@store/AppStore'

const MUST_HAVE_SOCKET_VALUE = '1'
const DELIMITER = ','

@Component({
    components: {
        Auctions: () => import('@components/Auctions.vue'),
    },
})
export default class App extends VuexComponent {
    ready = false

    created(): void {
        document.title = Constants.APP_NAME

        const savedFilters = this.$route.query as SavedFilters
        this.importFilters(savedFilters)

        this.ready = true
    }

    @Watch('region')
    @Watch('realm')
    @Watch('tier')
    @Watch('boes')
    @Watch('ilvlRange')
    @Watch('maxBuyout')
    @Watch('mustHaveSocket')
    @Watch('tertiaries')
    updateQuery(): void {
        const newFilters = this.exportFilters()

        if (_.isEqual(this.$router.currentRoute.query, newFilters)) {
            return
        }

        void this.$router.replace({
            query: newFilters,
        })
    }

    private importFilters(savedFilters: SavedFilters): void {
        if (savedFilters.region) {
            const validRegions = Object.values(Region)
            const region = savedFilters.region as Region
            if (validRegions.includes(region)) {
                this.changeRegion(region)
            }
        }
        if (savedFilters.realm) {
            const realm = parseInt(savedFilters.realm)
            this.changeRealm(realm)
        }

        if (savedFilters.tier) {
            const validTiers = Object.values(Tier)
            const tier = savedFilters.tier as Tier
            if (validTiers.includes(tier)) {
                this.changeTier(tier)
            }
        }
        if (this.tier === null) {
            this.changeTier(getDefaultTier())
        }

        if (savedFilters.boes) {
            const validBoeIds = getTierBoeIds(this.tier)
            const boeIds = importArray(savedFilters.boes).filter((boeId) => {
                return validBoeIds.includes(boeId)
            })

            this.changeBoes(new Set(boeIds))
        }
        if (savedFilters.ilvlRange) {
            const [min, max] = savedFilters.ilvlRange.split(DELIMITER).map((ilvl) => parseInt(ilvl))
            const defaultIlvlRange = getIlvlRange(this.tier)

            this.changeIlvlRange({
                min: isNaN(min) ? defaultIlvlRange.min : Math.max(min, defaultIlvlRange.min),
                max: isNaN(max) ? defaultIlvlRange.max : Math.min(max, defaultIlvlRange.max),
            })
        }
        if (savedFilters.maxBuyout) {
            const maxBuyout = parseInt(savedFilters.maxBuyout)
            this.changeMaxBuyout(isNaN(maxBuyout) ? Constants.MAX_GOLD : _.clamp(maxBuyout, 0, Constants.MAX_GOLD))
        }
        if (savedFilters.mustHaveSocket) {
            this.changeMustHaveSocket(savedFilters.mustHaveSocket === MUST_HAVE_SOCKET_VALUE)
        }
        if (savedFilters.tertiaries) {
            const validTertiaries = Object.values(Tertiary)
            const tertiaries = importArray(savedFilters.tertiaries).filter((tertiary) => {
                return validTertiaries.includes(tertiary)
            })

            this.changeTertiaries(new Set(tertiaries))
        }
    }

    private exportFilters(): SavedFilters {
        const savedFilters: SavedFilters = {}

        if (this.region) {
            savedFilters.region = this.region
        }
        if (this.realm) {
            savedFilters.realm = this.realm.toString()
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
        if (this.maxBuyout !== Constants.MAX_GOLD) {
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
body{
    height: 100%;
}

.app{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
