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
                        rounded
                        size="40px"
                    >
                        <img :src="getTierIcon(scope.opt)" :alt="getTierName(scope.opt)" width="40" height="40">
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
import { Component, Mixins } from 'vue-property-decorator'
import { VuexAccessor } from '@views/mixins/VuexAccessor'
import { ImageLoader } from '@views/mixins/ImageLoader'

import { Tier, TierConfigs } from '@common/Constants'

@Component
export default class TierFilter extends Mixins(VuexAccessor, ImageLoader) {
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
