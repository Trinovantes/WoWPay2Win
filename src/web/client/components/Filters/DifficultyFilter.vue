<script lang="ts" setup>
import { computed } from 'vue'
import { ALL_DIFFICULTIES, type Difficulty } from '../../../../common/ItemBonusId.ts'
import { useFilterStore } from '../../store/Filter/useFilterStore.ts'
import { UPGRADE_LIMIT } from '../../../../common/utils/getItemUpgrade.ts'

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
            Item Level
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

        <template v-if="filterStore.enableUpgradeFilter">
            <h2>
                Minimum Item Upgrade
            </h2>

            <q-slider
                v-model="filterStore.minUpgrade"
                :min="UPGRADE_LIMIT.MIN"
                :max="UPGRADE_LIMIT.MAX"
                label
            />
        </template>
    </div>
</template>
