import { computed } from 'vue'
import { useFilterStore } from '../../store/Filter'
import { TIER_CONFIGS } from '@/common/TierConfig'

export function useIsTierCategoryGear() {
    const filterStore = useFilterStore()
    const ilvlStep = computed(() => TIER_CONFIGS[filterStore.tier].ilvlStep)
    const ilvlRange = computed(() => TIER_CONFIGS[filterStore.tier].ilvlRange)
    const isTierCategoryGear = computed(() =>
        ilvlStep.value !== undefined &&
        ilvlStep.value > 0 &&
        ilvlRange.value !== undefined &&
        ilvlRange.value.min !== ilvlRange.value.max)

    return {
        ilvlStep,
        ilvlRange,
        isTierCategoryGear,
    }
}
