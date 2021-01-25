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

                    <div
                        v-if="category.ids.size > 1"
                        class="toggles"
                    >
                        <a
                            :class="{
                                'active': isNoneActive(category.ids)
                            }"
                            @click="toggleNone(category.ids)"
                        >
                            none
                        </a>
                        <a
                            :class="{
                                'active': isAllActive(category.ids)
                            }"
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
                        :href="getWowheadItemLinkById(id, region)"
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
        <div v-else>
            <q-banner class="bg-warning">
                <h2>BoEs for this tier are not available yet</h2>
            </q-banner>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { GameDataAccessor } from '@views/mixins/GameDataAccessor'
import { ImageLoader } from '@views/mixins/ImageLoader'

import { TierConfigs, IBoeCategory } from '@common/Constants'

@Component
export default class BoeFilter extends Mixins(GameDataAccessor, ImageLoader) {
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

    isAllActive(idsToCheck: Set<number>): boolean {
        for (const id of idsToCheck) {
            if (!this.boes.has(id)) {
                return false
            }
        }

        return true
    }

    isNoneActive(idsToCheck: Set<number>): boolean {
        for (const id of this.boes) {
            if (idsToCheck.has(id)) {
                return false
            }
        }

        return true
    }
}
</script>

<style lang="scss">
.boes{
    .toggles{
        flex: 1;

        a{
            background: var(--q-color-dark);
            border-radius: 15px;
            color: white;
            cursor: pointer;
            display: block;
            float: right;
            margin-left: $padding / 2;
            padding: 5px 10px;

            font-size: 11px;
            line-height: 20px;
            text-transform: uppercase;
            text-decoration: none;

            &.active{
                background: var(--q-color-primary);
            }

            &:hover{
                background: var(--q-color-secondary);
            }
        }
    }

    a.boe{
        display: block;
        font-size: 15px;
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
