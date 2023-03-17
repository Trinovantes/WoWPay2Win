<script lang="ts" setup>
import throttle from 'lodash.throttle'
import { ref, watch, computed } from 'vue'
import { useFilterStore } from '../../store/Filter'
import { convertGoldToPosition, convertPositionToGold } from './MaxBuyoutConversion'

const filterStore = useFilterStore()
const formatter = Intl.NumberFormat(undefined, { maximumFractionDigits: 0 })
const formatedMaxBuyout = computed(() => formatter.format(filterStore.maxBuyout))

const sliderPosition = ref(convertGoldToPosition(filterStore.maxBuyout))
watch(sliderPosition, throttle((sliderPosition: number) => {
    const maxBuyout = convertPositionToGold(sliderPosition)
    filterStore.maxBuyout = maxBuyout
}, 250))
</script>

<template>
    <div class="group padded">
        <h2>
            Max Buyout
        </h2>

        <q-slider
            v-model="sliderPosition"
            :label-value="formatedMaxBuyout"
            :min="0"
            :max="100"
            label
        />
    </div>
</template>
