<template>
    <div v-if="ilvls.min !== ilvls.max" class="group">
        <h2>Item Level Filter</h2>
        <div class="wrapper">
            <q-range
                v-model="selectedIlvlRange"
                :min="ilvls.min"
                :max="ilvls.max"
                :step="ilvls.step"
                snap
                label
            />
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { VuexAccessor } from '@views/mixins/VuexAccessor'

import { TierConfigs } from '@common/Constants'
import { IIlvlRange } from '@store/AppStore'

@Component
export default class ItemLevelFilter extends Mixins(VuexAccessor) {
    get ilvls(): { min: number; max: number; step: number } {
        if (this.tier === null) {
            return {
                min: 0,
                max: 0,
                step: 0,
            }
        }

        return TierConfigs[this.tier].ilvls
    }

    get selectedIlvlRange(): IIlvlRange {
        return this.ilvlRange
    }

    set selectedIlvlRange(ilvlRange: IIlvlRange) {
        this.changeIlvlRange(ilvlRange)
    }
}
</script>
