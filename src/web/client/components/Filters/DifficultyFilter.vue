<script lang="ts" setup>
import { computed } from 'vue'
import { ALL_DIFFICULTIES, type Difficulty } from '../../../../common/ItemBonusId.ts'
import { useFilterStore } from '../../store/Filter/useFilterStore.ts'

type SelectedDifficulty = Array<Difficulty>

const filterStore = useFilterStore()
const selectedDifficulty = computed<SelectedDifficulty>({
    get() {
        return [...filterStore.difficulties]
    },
    set(difficulties) {
        filterStore.difficulties = new Set(difficulties)
    },
})
</script>

<template>
    <div
        v-if="filterStore.enableDifficultyFilter"
        class="group vpad"
    >
        <h2>
            Item Level Filter
        </h2>

        <q-list dense>
            <q-item
                v-for="difficulty of ALL_DIFFICULTIES"
                :key="difficulty.key"
                v-ripple
                tag="label"
            >
                <q-item-section avatar>
                    <q-checkbox
                        v-model="selectedDifficulty"
                        :val="difficulty.key"
                    />
                </q-item-section>
                <q-item-section>
                    <q-item-label>
                        {{ difficulty.label }}
                    </q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </div>
</template>
