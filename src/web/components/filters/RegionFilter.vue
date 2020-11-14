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
import VuexComponent from '@components/base/VuexComponent'

import { Region, RegionConfigs } from '@common/Constants'

@Component
export default class RegionFilter extends VuexComponent {
    readonly regions = RegionConfigs.map((regionConfig) => regionConfig.slug)

    get selectedRegion(): Region | null {
        return this.region
    }

    set selectedRegion(regionSlug: Region | null) {
        this.changeRegion(regionSlug)
    }
}
</script>
