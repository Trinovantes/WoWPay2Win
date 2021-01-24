<template>
    <div class="group">
        <h2>Max Buyout</h2>
        <div class="wrapper">
            <q-slider
                v-model="buyoutSlider"
                :min="0"
                :max="MAX_SLIDER"
                label
                :label-value="Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(maxBuyout)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { VuexAccessor } from '@views/mixins/VuexAccessor'

import _ from 'lodash'

import Constants from '@common/Constants'

@Component
export default class MaxBuyoutFilter extends VuexAccessor {
    readonly MAX_SLIDER = 100
    readonly SLIDER_TIERS = [
        [25, 100 * 1000],
        [50, 500 * 1000],
        [75, 1000 * 1000],
        [this.MAX_SLIDER, Constants.GOLD_CAP],
    ]

    sliderPosition = this.MAX_SLIDER

    get buyoutSlider(): number {
        return this.convertGoldToPos(this.maxBuyout)
    }

    set buyoutSlider(pos: number) {
        this.throttledChangeMaxBuyout(this.convertPosToGold(pos))
    }

    private throttledChangeMaxBuyout = _.throttle((maxBuyout: number) => {
        this.changeMaxBuyout(maxBuyout)
    }, 500)

    private convertPosToGold(pos: number): number {
        let posMin = 0
        let goldMin = 0

        for (const [posMax, goldMax] of this.SLIDER_TIERS) {
            if (pos <= posMax) {
                const scale = (goldMax - goldMin) / (posMax - posMin)
                const gold = goldMin + scale * (pos - posMin)
                return gold
            }

            posMin = posMax
            goldMin = goldMax
        }

        throw new Error(`Invalid slider position for conversion ${pos}`)
    }

    private convertGoldToPos(gold: number): number {
        let posMin = 0
        let goldMin = 0

        for (const [posMax, goldMax] of this.SLIDER_TIERS) {
            if (gold <= goldMax) {
                const scale = (posMax - posMin) / (goldMax - goldMin)
                const pos = posMin + scale * (gold - goldMin)
                return pos
            }

            posMin = posMax
            goldMin = goldMax
        }

        throw new Error(`Invalid gold amount for conversion ${gold}`)
    }
}

</script>
