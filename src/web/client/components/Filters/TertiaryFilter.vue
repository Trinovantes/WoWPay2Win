<script lang="ts" setup>
import { computed } from 'vue'
import { useFilterStore } from '../../store/Filter'
import { ALL_TERTIARIES, Tertiary } from '@/common/BonusId'
import { useIsTierCategoryGear } from './useIsTierCategoryGear'

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

const { isTierCategoryGear } = useIsTierCategoryGear()
</script>

<template>
    <div
        v-if="isTierCategoryGear"
        class="group vpad"
    >
        <h2>
            Tertiaries
        </h2>

        <q-list dense>
            <q-item
                v-for="tertiary of ALL_TERTIARIES"
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
