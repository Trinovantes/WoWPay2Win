<script lang="ts" setup>
import { computed } from 'vue'
import { useFilterStore } from '../../store/Filter'
import type { IlvlRange } from '@/common/TierConfig'
import { useIsTierCategoryGear } from './useIsTierCategoryGear'

const filterStore = useFilterStore()
const selectedIlvlRange = computed<IlvlRange>({
    get() {
        return filterStore.ilvlRange
    },
    set(ilvlRange) {
        filterStore.ilvlRange = ilvlRange
    },
})

const { ilvlStep, ilvlRange, isTierCategoryGear } = useIsTierCategoryGear()
</script>

<template>
    <div
        v-if="isTierCategoryGear && ilvlStep && ilvlRange"
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
