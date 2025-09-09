<script lang="ts" setup>
import { useFilterStore } from '../../store/Filter/useFilterStore.ts'

const filterStore = useFilterStore()
</script>

<template>
    <div
        v-if="filterStore.enableIlvlFilter"
        class="group padded"
    >
        <h2>
            Item Level Filter
        </h2>

        <q-range
            v-model="filterStore.ilvlRange"
            :min="filterStore.currentTierIlvlRange?.min"
            :max="filterStore.currentTierIlvlRange?.max"
            :step="filterStore.currentTierIlvlStep"
            snap
            label
        />
    </div>
</template>
