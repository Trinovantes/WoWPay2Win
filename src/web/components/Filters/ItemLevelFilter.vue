<template>
    <div v-if="isValidRange" class="group">
        <h2>Item Level Filter</h2>
        <div class="wrapper">
            <q-range
                v-model="selectedIlvlRange"
                :min="tierIlvls.min"
                :max="tierIlvls.max"
                :step="tierIlvls.step"
                snap
                label
            />
        </div>
    </div>
</template>

<script lang="ts">
import { IlvlRange, TierConfig, TIER_CONFIGS } from '@/common/Constants'
import { useFilterStore } from '@/web/store/Filter'
import { FilterMutation } from '@/web/store/Filter/mutations'
import { computed, defineComponent } from 'vue'

export default defineComponent({
    setup() {
        const filterStore = useFilterStore()
        const selectedIlvlRange = computed<IlvlRange>({
            get() {
                return filterStore.state.ilvlRange
            },
            set(ilvlRange) {
                filterStore.commit(FilterMutation.SET_ILVL_RANGE, ilvlRange)
            },
        })

        const tierIlvls = computed<TierConfig['ilvls']>(() => {
            if (filterStore.state.tier === null) {
                return {
                    min: 0,
                    max: 0,
                    step: 0,
                }
            }

            return TIER_CONFIGS[filterStore.state.tier].ilvls
        })

        const isValidRange = computed<boolean>(() => tierIlvls.value.min !== tierIlvls.value.max && tierIlvls.value.step > 0)

        return {
            selectedIlvlRange,
            tierIlvls,
            isValidRange,
        }
    },
})
</script>
