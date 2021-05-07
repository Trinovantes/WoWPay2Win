<template>
    <div class="group">
        <h2>Max Buyout</h2>
        <div class="wrapper">
            <q-slider
                v-model="sliderPosition"
                :label-value="formatedMaxBuyout"
                :min="0"
                :max="100"
                label
            />
        </div>
    </div>
</template>

<script lang="ts">
import { GOLD_CAP } from '@/common/Constants'
import { useFilterStore } from '@/web/store/Filter'
import { FilterMutation } from '@/web/store/Filter/mutations'
import { ref, watch, computed, defineComponent } from 'vue'
import { throttle } from 'lodash'

export default defineComponent({
    setup() {
        const filterStore = useFilterStore()

        const formatter = Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })
        const formatedMaxBuyout = computed<string>(() => {
            return formatter.format(filterStore.state.maxBuyout)
        })

        const throttledUpdateMaxBuyout = throttle((sliderPosition: number) => {
            const maxBuyout = convertPositionToGold(sliderPosition)
            filterStore.commit(FilterMutation.SET_MAX_BUYOUT, maxBuyout)
        }, 500)

        const sliderPosition = ref(100)
        watch(sliderPosition, () => {
            throttledUpdateMaxBuyout(sliderPosition.value)
        })

        return {
            formatedMaxBuyout,
            sliderPosition,
        }
    },
})

const SLIDER_TIERS = [
    [25, 100 * 1000],
    [50, 500 * 1000],
    [75, 1000 * 1000],
    [100, GOLD_CAP],
]

function convertPositionToGold(pos: number): number {
    let posMin = 0
    let goldMin = 0

    for (const [posMax, goldMax] of SLIDER_TIERS) {
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
</script>
