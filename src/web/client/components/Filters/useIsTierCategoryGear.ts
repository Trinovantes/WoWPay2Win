import { computed } from 'vue'
import { useFilterStore } from '../../store/Filter'

export function useIsTierCategoryGear() {
    const filterStore = useFilterStore()
    const isTierCategoryGear = computed<boolean>(() => {
        const ilvlStep = filterStore.currentTierIlvlStep
        if (ilvlStep === undefined) {
            return false
        }

        const ilvlRange = filterStore.currentTierIlvlRange
        if (!ilvlRange) {
            return false
        }

        return ilvlStep > 0 && ilvlRange.min !== ilvlRange.max
    })

    return {
        isTierCategoryGear,
    }
}
