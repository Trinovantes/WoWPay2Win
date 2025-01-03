<script lang="ts" setup>
import { useFilterStore } from '../../store/Filter'
import { useIsTierCategoryGear } from './useIsTierCategoryGear'

const filterStore = useFilterStore()
const { isTierCategoryGear } = useIsTierCategoryGear()
</script>

<template>
    <div
        v-if="isTierCategoryGear && filterStore.currentTierIlvlStep && filterStore.currentTierIlvlRange"
        class="group padded"
    >
        <h2>
            Item Level Filter
        </h2>

        <q-range
            v-model="filterStore.ilvlRange"
            :min="filterStore.currentTierIlvlRange.min"
            :max="filterStore.currentTierIlvlRange.max"
            :step="filterStore.currentTierIlvlStep"
            snap
            label
        />
    </div>
</template>
