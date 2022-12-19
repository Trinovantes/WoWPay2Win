<script lang="ts" setup>
import { computed } from 'vue'
import { useFilterStore } from '../../store/Filter'
import { IlvlRange, TIER_CONFIGS } from '@/common/TierConfig'

const filterStore = useFilterStore()
const selectedIlvlRange = computed<IlvlRange>({
    get() {
        return filterStore.ilvlRange
    },
    set(ilvlRange) {
        filterStore.ilvlRange = ilvlRange
    },
})

const ilvlRange = computed(() => TIER_CONFIGS[filterStore.tier].ilvlRange)
const ilvlStep = computed(() => TIER_CONFIGS[filterStore.tier].ilvlStep)
const isValidRange = computed(() => ilvlRange.value.min !== ilvlRange.value.max && ilvlStep.value > 0)
</script>

<template>
    <div
        v-if="isValidRange"
        class="group padded"
    >
        <h2>
            Item Level Filter
        </h2>

        <q-range
            v-model="selectedIlvlRange"
            :min="ilvlRange.min"
            :max="ilvlRange.max"
            :step="ilvlStep"
            snap
            label
        />
    </div>
</template>
