<template>
    <q-select
        v-model="selectedRegion"
        :display-value="(selectedRegion ?? '').toUpperCase()"
        :options="allRegions"
        :option-label="(regionSlug) => (regionSlug ?? '').toUpperCase()"
        square
        filled
        label="Region"
        color="secondary"
        label-color="white"
    />
</template>

<script lang="ts">
import { REGION_CONFIGS } from '@/common/Constants'
import { RegionFilter, useFilterStore } from '@/web/store/Filter'
import { FilterMutation } from '@/web/store/Filter/mutations'
import { computed, defineComponent } from 'vue'

export default defineComponent({
    setup() {
        const filterStore = useFilterStore()
        const selectedRegion = computed<RegionFilter>({
            get() {
                return filterStore.state.region
            },
            set(region) {
                filterStore.commit(FilterMutation.SET_REGION, region)
            },
        })

        const allRegions = REGION_CONFIGS.map((regionConfig) => regionConfig.slug)

        return {
            selectedRegion,
            allRegions,
        }
    },
})
</script>
