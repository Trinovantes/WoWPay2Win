<script lang="ts" setup>
import { computed } from 'vue'
import { getTierName, Tier } from '@/common/Boe'
import { useFilterStore } from '../../store/Filter'
import { getTierIcon } from '../../utils/ImageLoader'
import { tierConfigMap } from '../../utils/GameData'

const filterStore = useFilterStore()
const selectedTier = computed<Tier>({
    get() {
        return filterStore.tier
    },
    set(tier) {
        filterStore.changeTier(tier)
    },
})

const allTiers = [...tierConfigMap.keys()]
</script>

<template>
    <q-select
        v-model="selectedTier"
        :options="allTiers"
        square
        filled
        label="Tier"
        color="secondary"
        label-color="white"
    >
        <template #selected-item="scope">
            {{ getTierName(tierConfigMap, scope.opt) }}
        </template>
        <template #option="scope">
            <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                    <q-avatar
                        rounded
                        size="40px"
                    >
                        <img
                            :src="getTierIcon(tierConfigMap, scope.opt)"
                            :alt="getTierName(tierConfigMap, scope.opt)"
                            width="40"
                            height="40"
                        >
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                    {{ getTierName(tierConfigMap, scope.opt) }}
                </q-item-section>
            </q-item>
        </template>
    </q-select>
</template>
