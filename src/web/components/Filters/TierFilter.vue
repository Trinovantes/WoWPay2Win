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
                        <img :src="getTierIcon(scope.opt)" :alt="getTierName(scope.opt)" width="40" height="40">
                    </q-avatar>
                </q-item-section>
                <q-item-section>
                    {{ getTierName(scope.opt) }}
                </q-item-section>
            </q-item>
        </template>
    </q-select>
</template>

<script lang="ts">
import { Tier, TIER_CONFIGS } from '@/common/Constants'
import { defineComponent, computed } from 'vue'
import { getTierIcon } from '@/web/utils/ImageLoader'
import { useFilterStore } from '@/web/store/Filter'
import { FilterMutation } from '@/web/store/Filter/mutations'

export default defineComponent({
    setup() {
        const filterStore = useFilterStore()
        const selectedTier = computed<Tier>({
            get() {
                return filterStore.state.tier
            },
            set(tier) {
                filterStore.commit(FilterMutation.SET_TIER, tier)
            },
        })

        const allTiers = Object.keys(TIER_CONFIGS).map((key) => key as Tier).reverse()
        const getTierName = (tier: Tier): string => {
            return TIER_CONFIGS[tier].name
        }

        return {
            selectedTier,
            allTiers,

            getTierIcon,
            getTierName,
        }
    },
})
</script>
