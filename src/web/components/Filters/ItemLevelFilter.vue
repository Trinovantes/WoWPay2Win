<script lang="ts">
import { IlvlRange, TIER_CONFIGS } from '@/common/Constants'
import { useFilterStore } from '@/web/store/Filter'
import { computed, defineComponent } from 'vue'

export default defineComponent({
    setup() {
        const filterStore = useFilterStore()
        const selectedIlvlRange = computed<IlvlRange>({
            get() {
                return filterStore.ilvlRange
            },
            set(ilvlRange) {
                filterStore.ilvlRange = ilvlRange
            },
        })

        const tierIlvls = computed(() => TIER_CONFIGS[filterStore.tier].ilvls)
        const isValidRange = computed(() => tierIlvls.value.min !== tierIlvls.value.max && tierIlvls.value.step > 0)

        return {
            selectedIlvlRange,
            tierIlvls,
            isValidRange,
        }
    },
})
</script>

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
