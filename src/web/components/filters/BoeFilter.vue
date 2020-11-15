<template>
    <div class="boes">
        <div
            v-if="categories.length > 0"
            class="group"
        >
            <div
                v-for="category of categories"
                :key="category.label"
            >
                <h2>
                    {{ category.label }}

                    <div class="toggles">
                        <a @click="toggleNone(category.ids)">none</a>
                        <a @click="toggleAll(category.ids)">all</a>
                    </div>
                </h2>
                <q-list>
                    <a
                        v-for="id of category.ids"
                        :key="id"
                        :href="getWowheadItemLinkById(id)"
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
                                    <img :src="getItemIcon(id)" :alt="getItemName(id)" width="40" height="40">
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
        <div v-else>
            <q-banner class="bg-warning">
                <h2>BoEs for this tier are not available yet</h2>
            </q-banner>
        </div>
    </div>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import VuexComponent from '@components/base/VuexComponent'
import DataComponent from '@components/base/DataComponent'
import ImageComponent from '@components/base/ImageComponent'

import { TierConfigs, IBoeCategory } from '@common/Constants'

@Component
export default class BoeFilter extends mixins(VuexComponent, DataComponent, ImageComponent) {
    get categories(): Array<IBoeCategory> {
        if (this.tier) {
            return TierConfigs[this.tier].boes
        } else {
            return []
        }
    }

    get selectedBoes(): Array<number> {
        return [...this.boes.values()]
    }

    set selectedBoes(boes: Array<number>) {
        this.changeBoes(new Set(boes))
    }

    toggleAll(idsToAdd: Set<number>): void {
        const ids: Set<number> = new Set(this.boes)

        for (const id of idsToAdd) {
            ids.add(id)
        }

        this.changeBoes(ids)
    }

    toggleNone(idsToRemove: Set<number>): void {
        const ids: Set<number> = new Set(this.boes)

        for (const id of idsToRemove) {
            ids.delete(id)
        }

        this.changeBoes(ids)
    }
}
</script>

<style lang="scss">
.boes{
    a.boe{
        font-size: 15px;

        display: block;
        text-decoration: none;

        .q-item{
            color: white;

            &.q-item--active{
                background: var(--q-color-primary)
            }
        }

        .q-checkbox{
            display: none;
        }
    }
}
</style>
