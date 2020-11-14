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
                    <q-item
                        v-for="id of category.ids"
                        :key="id"
                        v-ripple
                        clickable
                        :active="selectedBoes.includes(id)"
                        tag="label"
                    >
                        <q-checkbox
                            v-model="selectedBoes"
                            :val="id"
                            hidden
                        />
                        <a :data-wowhead="`item=${id}`">
                            <q-item-section avatar>
                                <q-avatar
                                    rounded
                                >
                                    <img :src="getItemIcon(id)">
                                </q-avatar>
                            </q-item-section>
                            <q-item-section>
                                {{ getItemName(id) }}
                            </q-item-section>
                        </a>
                    </q-item>
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
    .q-item{
        &.q-item--active{
            background: var(--q-color-primary)
        }
    }

    .q-checkbox{
        display: none;
    }

    a[data-wowhead]{
        font-size: 15px;

        display: flex;
        color: white;
        text-decoration: none;
    }
}
</style>
