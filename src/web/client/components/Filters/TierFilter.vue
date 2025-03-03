<script lang="ts" setup>
import { computed } from 'vue'
import { useFilterStore } from '../../store/Filter'
import { getTierIcon } from '../../utils/ImageLoader'
import { getTierName, Tier, tierConfigs } from '@/common/Boe'

const filterStore = useFilterStore()
const selectedTier = computed<Tier>({
    get() {
        return filterStore.tier
    },
    set(tier) {
        filterStore.changeTier(tier)
    },
})

const allTiers = [...tierConfigs.keys()]
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
            {{ getTierName(scope.opt) }}
        </template>
        <template #option="scope">
            <q-item v-bind="scope.itemProps">
                <q-item-section avatar>
                    <q-avatar
                        rounded
                        size="40px"
                    >
                        <img
                            :src="getTierIcon(scope.opt)"
                            :alt="getTierName(scope.opt)"
                            width="40"
                            height="40"
                        >
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                    {{ getTierName(scope.opt) }}
                </q-item-section>
            </q-item>
        </template>
    </q-select>
</template>
