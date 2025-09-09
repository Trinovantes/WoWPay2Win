<script lang="ts" setup>
import { computed } from 'vue'
import { useFilterStore } from '../../store/Filter/useFilterStore.ts'
import { ALL_SECONDARIES, type Secondary } from '../../../../common/ItemBonusId.ts'

type SelectedSecondaries = Array<Secondary>

const filterStore = useFilterStore()
const selectedTeriary = computed<SelectedSecondaries>({
    get() {
        return [...filterStore.secondaries]
    },
    set(secondaries) {
        filterStore.secondaries = new Set(secondaries)
    },
})
</script>

<template>
    <div
        v-if="filterStore.enableSecondaryFilter"
        class="group vpad"
    >
        <h2>
            Secondaries
        </h2>

        <q-list dense>
            <q-item
                v-for="secondary of ALL_SECONDARIES"
                :key="secondary.key"
                v-ripple
                tag="label"
            >
                <q-item-section avatar>
                    <q-checkbox
                        v-model="selectedTeriary"
                        :val="secondary.key"
                    />
                </q-item-section>
                <q-item-section>
                    <q-item-label>
                        {{ secondary.label }}
                    </q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </div>
</template>
