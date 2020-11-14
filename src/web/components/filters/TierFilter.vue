<template>
    <q-select
        v-model="selectedTier"
        :options="tiers"
        square
        filled
        label="Tier"
        color="secondary"
        label-color="white"
        :display-value="getTierName(selectedTier)"
    >
        <template #option="scope">
            <q-item
                v-bind="scope.itemProps"
                v-on="scope.itemEvents"
            >
                <q-item-section avatar>
                    <q-avatar
                        size="xl"
                        rounded
                    >
                        <img :src="getTierIcon(scope.opt)">
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                    {{ getTierName(scope.opt) }}
                </q-item-section>
            </q-item>
        </template>
    </q-select>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import VuexComponent from '@components/base/VuexComponent'
import ImageComponent from '@components/base/ImageComponent'

import { Tier, TierConfigs } from '@common/Constants'

@Component
export default class TierFilter extends mixins(VuexComponent, ImageComponent) {
    readonly tiers: Array<Tier> = Object.keys(TierConfigs).map((key) => key as Tier)

    get selectedTier(): Tier | null {
        return this.tier
    }

    set selectedTier(tier: Tier | null) {
        this.changeTier(tier)
    }

    getTierName(tier: Tier | null): string {
        if (tier === null) {
            return ''
        }

        return TierConfigs[tier].name
    }
}
</script>
