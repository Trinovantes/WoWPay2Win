<template>
    <div class="group">
        <h2>Max Buyout</h2>
        <div class="wrapper">
            <q-slider
                v-model="selectedMaxBuyout"
                :min="0"
                :max="MAX_GOLD"
                :step="MAX_GOLD / 100"
                label
                :label-value="Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(maxBuyout)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import VuexComponent from '@components/base/VuexComponent'

import _ from 'lodash'

import Constants from '@common/Constants'

@Component
export default class MaxBuyoutFilter extends VuexComponent {
    readonly MAX_GOLD = Constants.MAX_GOLD

    get selectedMaxBuyout(): number {
        return this.maxBuyout
    }

    set selectedMaxBuyout(maxBuyout: number) {
        this.throttledChangeMaxBuyout(maxBuyout)
    }

    private throttledChangeMaxBuyout = _.throttle((maxBuyout: number) => {
        this.changeMaxBuyout(maxBuyout)
    }, 500)
}

</script>
