<template>
    <q-select
        v-model="selectedRegion"
        :options="regions"
        square
        filled
        label="Region"
        color="secondary"
        label-color="white"
        :display-value="(selectedRegion || '').toUpperCase()"
        :option-label="(val) => (val || '').toUpperCase()"
    />
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { VuexAccessor } from '@views/mixins/VuexAccessor'

import { RegionSlug, RegionConfigs } from '@common/Constants'

@Component
export default class RegionFilter extends VuexAccessor {
    readonly regions = RegionConfigs.map((regionConfig) => regionConfig.slug)

    get selectedRegion(): RegionSlug | null {
        return this.region
    }

    set selectedRegion(regionSlug: RegionSlug | null) {
        this.changeRegion(regionSlug)
    }
}
</script>
