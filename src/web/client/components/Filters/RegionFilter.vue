<script lang="ts" setup>
import { computed } from 'vue'
import { RegionFilter, useFilterStore } from '../../store/Filter'
import { REGION_CONFIGS } from '@/common/RegionConfig'

const filterStore = useFilterStore()
const selectedRegion = computed<RegionFilter>({
    get() {
        return filterStore.region
    },
    set(region) {
        filterStore.changeRegion(region)
    },
})

const allRegions = REGION_CONFIGS.map((regionConfig) => regionConfig.slug)
</script>

<template>
    <q-select
        v-model="selectedRegion"
        :display-value="(selectedRegion ?? '').toUpperCase()"
        :options="allRegions"
        :option-label="(regionSlug: string) => (regionSlug ?? '').toUpperCase()"
        square
        filled
        label="Region"
        color="secondary"
        label-color="white"
    />
</template>
