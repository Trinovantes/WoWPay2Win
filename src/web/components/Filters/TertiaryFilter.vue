<script lang="ts" setup>
import { useQuasar } from 'quasar/src/index.all'
import { computed } from 'vue'
import { Tertiary } from '@/common/BonusId'
import { useFilterStore } from '@/web/store/Filter'

defineExpose({
    $q: useQuasar(),
})

type SelectedTertiaries = Array<Tertiary>

const filterStore = useFilterStore()
const selectedTeriary = computed<SelectedTertiaries>({
    get() {
        return [...filterStore.tertiaries]
    },
    set(tertiaries) {
        filterStore.tertiaries = new Set(tertiaries)
    },
})

const allTertiaries: Array<{ label: string; bonusId: number }> = []
for (const [label, tertiaryId] of Object.entries(Tertiary)) {
    const bonusId = Number(tertiaryId)
    if (isNaN(bonusId)) {
        continue
    }

    allTertiaries.push({
        label,
        bonusId,
    })
}
</script>

<template>
    <div class="group vpad">
        <h2>
            Tertiaries
        </h2>

        <q-list dense>
            <q-item
                v-for="tertiary of allTertiaries"
                :key="tertiary.bonusId"
                v-ripple
                tag="label"
            >
                <q-item-section avatar>
                    <q-checkbox
                        v-model="selectedTeriary"
                        :val="tertiary.bonusId"
                    />
                </q-item-section>
                <q-item-section>
                    <q-item-label>
                        {{ tertiary.label }}
                    </q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </div>
</template>
