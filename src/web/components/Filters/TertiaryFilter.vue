<template>
    <div class="group">
        <h2>Tertiaries</h2>
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

<script lang="ts">
import { Tertiary } from '@/common/BonusId'
import { useFilterStore } from '@/web/store/Filter'
import { FilterMutation } from '@/web/store/Filter/mutations'
import { defineComponent, computed } from 'vue'

type SelectedTertiaries = Array<Tertiary>

export default defineComponent({
    setup() {
        const filterStore = useFilterStore()
        const selectedTeriary = computed<SelectedTertiaries>({
            get() {
                return [...filterStore.state.tertiaries]
            },
            set(tertiaries) {
                filterStore.commit(FilterMutation.SET_TERTIARIES, new Set(tertiaries))
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

        return {
            selectedTeriary,
            allTertiaries,
        }
    },
})
</script>
