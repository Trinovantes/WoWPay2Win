<template>
    <div
        v-if="boeCategories.length > 0"
        class="group boes"
    >
        <div
            v-for="category of boeCategories"
            :key="category.label"
        >
            <h2>
                {{ category.label }}

                <div
                    v-if="category.ids.size > 1"
                    class="toggles"
                >
                    <a
                        :class="{ 'active': isNoneActive(category.ids) }"
                        @click="toggleNone(category.ids)"
                    >
                        none
                    </a>
                    <a
                        :class="{ 'active': isAllActive(category.ids) }"
                        @click="toggleAll(category.ids)"
                    >
                        all
                    </a>
                </div>
            </h2>
            <q-list dense>
                <a
                    v-for="id of category.ids"
                    :key="id"
                    :href="getWowheadLink(id)"
                    :data-wowhead="`item=${id}`"
                    class="boe"
                    rel="noopener"
                    target="_blank"
                    @click="(event) => event.stopPropagation()"
                >
                    <q-item
                        v-ripple
                        clickable
                        tag="label"
                        :active="selectedBoes.includes(id)"
                    >
                        <q-checkbox
                            v-model="selectedBoes"
                            :val="id"
                            hidden
                        />
                        <q-item-section avatar>
                            <q-avatar
                                rounded
                                size="40px"
                            >
                                <img
                                    v-if="getItemIcon(id)"
                                    :src="getItemIcon(id)"
                                    :alt="getItemName(id)"
                                    width="40"
                                    height="40"
                                >
                                <q-icon
                                    v-else
                                    name="error_outline"
                                    size="40px"
                                />
                            </q-avatar>
                        </q-item-section>
                        <q-item-section>
                            {{ getItemName(id) }}
                        </q-item-section>
                    </q-item>
                </a>
            </q-list>
        </div>
    </div>
</template>

<script lang="ts">
import { TIER_CONFIGS } from '@/common/Constants'
import { useFilterStore } from '@/web/store/Filter'
import { FilterMutation } from '@/web/store/Filter/mutations'
import { computed, defineComponent } from 'vue'
import { getItemIcon } from '@/web/utils/ImageLoader'
import { getItemNameById, getWowheadItemLinkById } from '@/web/utils/GameData'

type SelectedBoes = Array<number>

export default defineComponent({
    setup() {
        const filterStore = useFilterStore()
        const boeCategories = computed(() => TIER_CONFIGS[filterStore.state.tier].boes)
        const selectedBoes = computed<SelectedBoes>({
            get() {
                return [...filterStore.state.boes]
            },
            set(boes) {
                filterStore.commit(FilterMutation.SET_BOES, new Set(boes))
            },
        })

        const toggleAll = (idsToAdd: Set<number>) => {
            const currentSelected = new Set(filterStore.state.boes)
            for (const id of idsToAdd) {
                currentSelected.add(id)
            }

            filterStore.commit(FilterMutation.SET_BOES, currentSelected)
        }
        const toggleNone = (idsToRemove: Set<number>) => {
            const currentSelected = new Set(filterStore.state.boes)
            for (const id of idsToRemove) {
                currentSelected.delete(id)
            }

            filterStore.commit(FilterMutation.SET_BOES, currentSelected)
        }

        const isAllActive = (idsToCheck: SelectedBoes): boolean => {
            for (const id of idsToCheck) {
                if (!selectedBoes.value.includes(id)) {
                    return false
                }
            }

            return true
        }
        const isNoneActive = (idsToCheck: SelectedBoes): boolean => {
            for (const id of idsToCheck) {
                if (selectedBoes.value.includes(id)) {
                    return false
                }
            }

            return true
        }

        const region = computed(() => filterStore.state.region)
        const getWowheadLink = (itemId: number) => {
            if (!region.value) {
                return ''
            }

            return getWowheadItemLinkById(itemId, region.value)
        }
        const getItemName = (itemId: number) => {
            if (!region.value) {
                return ''
            }

            return getItemNameById(itemId, region.value)
        }

        return {
            boeCategories,
            selectedBoes,

            toggleAll,
            toggleNone,

            isAllActive,
            isNoneActive,

            getWowheadLink,
            getItemIcon,
            getItemName,
        }
    },
})
</script>

<style lang="scss">
.boes{
    .toggles{
        flex: 1;

        a{
            background: $dark;
            border-radius: 15px;
            color: white;
            cursor: pointer;
            display: block;
            float: right;
            margin-left: $padding / 2;
            padding: 5px 10px;

            font-size: 0.75rem;
            line-height: 20px;
            text-transform: uppercase;
            text-decoration: none;

            &.active{
                background: $primary;
            }

            &:hover{
                background: $secondary;
            }
        }
    }

    a.boe{
        display: block;
        text-decoration: none;

        .q-item{
            color: white;

            &.q-item--active{
                background: $primary
            }
        }

        .q-checkbox{
            display: none;
        }
    }
}
</style>
