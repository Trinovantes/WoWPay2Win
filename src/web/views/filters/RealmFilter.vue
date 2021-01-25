<template>
    <div class="group">
        <h2>Realm Filter</h2>
        <q-select
            v-model="selectedRealms"
            :options="filteredRealms"
            emit-value
            multiple
            use-input
            use-chips
            map-options
            option-label="name"
            option-value="id"

            filled
            label="Realm"
            color="secondary"
            label-color="white"
            spellcheck="false"
            input-debounce="250"
            clearable

            @filter="filterFn"
        >
            <template #no-option>
                <q-item>
                    <q-item-section class="text-grey">
                        No results
                    </q-item-section>
                </q-item>
            </template>
        </q-select>
    </div>
</template>

<script lang="ts">
import { Component, Watch, Mixins } from 'vue-property-decorator'
import { GameDataAccessor } from '@views/mixins/GameDataAccessor'

import { IRealmCache } from '@common/ICache'

@Component
export default class RealmFilter extends Mixins(GameDataAccessor) {
    filteredRealms: Array<IRealmCache> = []

    created(): void {
        this.updateFilteredRealms()
    }

    @Watch('realms')
    updateFilteredRealms(): void {
        this.filteredRealms = this.regionRealms
    }

    filterFn(val: string, doneFn: (callbackFn: () => void) => void): void {
        doneFn(() => {
            const needle = val.toLowerCase()
            this.filteredRealms = this.regionRealms.filter((realm) => realm.name.toLowerCase().indexOf(needle) > -1)
        })
    }

    get selectedRealms(): Array<number> {
        return [...this.realms.values()]
    }

    set selectedRealms(selectedRealms: Array<number>) {
        this.changeRealms(new Set(selectedRealms))
    }
}

</script>
