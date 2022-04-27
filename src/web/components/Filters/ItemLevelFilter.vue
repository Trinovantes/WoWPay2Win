<script lang="ts" setup>
import { computed } from 'vue'
import { IlvlRange, TIER_CONFIGS } from '@/common/Constants'
import { useFilterStore } from '@/web/store/Filter'

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
</script>

<template>
    <div
        v-if="isValidRange"
        class="group padded"
    >
        <h2>
            Item Level Filter
        </h2>

        <q-range
            v-model="selectedIlvlRange"
            :min="tierIlvls.min"
            :max="tierIlvls.max"
            :step="tierIlvls.step"
            snap
            label
        />
    </div>
</template>
