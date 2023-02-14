<script lang="ts" setup>
import { computed } from 'vue'
import { useFilterStore } from '../../store/Filter'
import { getItemIcon } from '../../utils/ImageLoader'
import { getItemNameById } from '../../utils/getItemNameById'
import { getWowheadItemLinkById } from '../../utils/getWowheadItemLinkById'
import { TIER_CONFIGS } from '@/common/TierConfig'

const filterStore = useFilterStore()
const boeCategories = computed(() => TIER_CONFIGS[filterStore.tier].boes)
const selectedBoes = computed<Array<number>>({
    get() {
        return [...filterStore.boes]
    },
    set(boes) {
        filterStore.boes = new Set(boes)
    },
})

const toggleAll = (idsToAdd: ReadonlyArray<number>) => {
    const currentSelected = new Set(filterStore.boes)
    for (const id of idsToAdd) {
        currentSelected.add(id)
    }

    filterStore.boes = currentSelected
}
const toggleNone = (idsToRemove: ReadonlyArray<number>) => {
    const currentSelected = new Set(filterStore.boes)
    for (const id of idsToRemove) {
        currentSelected.delete(id)
    }

    filterStore.boes = currentSelected
}

const isAllActive = (idsToCheck: ReadonlyArray<number>): boolean => {
    for (const id of idsToCheck) {
        if (!selectedBoes.value.includes(id)) {
            return false
        }
    }

    return true
}
const isNoneActive = (idsToCheck: ReadonlyArray<number>): boolean => {
    for (const id of idsToCheck) {
        if (selectedBoes.value.includes(id)) {
            return false
        }
    }

    return true
}

const region = computed(() => filterStore.region)
const getWowheadLink = (itemId: number) => {
    if (region.value === null) {
        return ''
    }

    return getWowheadItemLinkById(itemId, region.value)
}
const getItemName = (itemId: number) => {
    if (region.value === null) {
        return ''
    }

    return getItemNameById(itemId, region.value)
}

const tierName = computed(() => TIER_CONFIGS[filterStore.tier].name)
</script>

<template>
    <q-banner
        v-if="boeCategories.length === 0"
    >
        No BoEs available for {{ tierName }}
    </q-banner>

    <div
        v-else
        class="group"
    >
        <div
            v-for="category of boeCategories"
            :key="category.label"
        >
            <h2>
                {{ category.label }}

                <div
                    v-if="category.ids.length > 1"
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

<style lang="scss" scoped>
.group{
    display: flex;
    flex-direction: column;
    gap: $side-padding;
    padding: $side-padding 0;
}

h2 {
    display: flex;
    align-items: center;

    .toggles{
        flex: 1;

        a{
            background: $dark;
            border-radius: 15px;
            color: white;
            cursor: pointer;
            display: block;
            float: right;
            margin-left: math.div($padding, 2);
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
}

.q-list{
    a.boe{
        display: block;
        text-decoration: none;

        .q-checkbox{
            display: none;
        }

        .q-item{
            &.q-item--active{
                background: $primary
            }

            .q-item__section--avatar{
                padding-right: $padding;
            }

            .q-item__label--caption{
                color: #aaa;
                line-height: $line-height !important;
                margin-top: math.div($padding, 2);
            }
        }
    }
}
</style>
