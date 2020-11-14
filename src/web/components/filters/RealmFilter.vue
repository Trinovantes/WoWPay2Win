<template>
    <div class="group">
        <h2>Realm Filter</h2>
        <q-select
            v-model="selectedRealm"
            :options="filteredRealms"
            map-options
            emit-value
            filled
            clearable
            label="Realm"
            color="secondary"
            label-color="white"
            option-label="name"
            option-value="id"
            use-input
            hide-selected
            fill-input
            input-debounce="250"
            spellcheck="false"
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
import Component, { mixins } from 'vue-class-component'
import VuexComponent from '@components/base/VuexComponent'
import DataComponent from '@components/base/DataComponent'
import { Watch } from 'vue-property-decorator'

import { IRealmCache } from '@common/ICache'

@Component
export default class RealmFilter extends mixins(VuexComponent, DataComponent) {
    filteredRealms: Array<IRealmCache> = []

    created(): void {
        this.updateFilteredRealms()
    }

    @Watch('realms')
    updateFilteredRealms(): void {
        this.filteredRealms = this.realms
    }

    filterFn(val: string, doneFn: (callbackFn: () => void) => void): void {
        doneFn(() => {
            const needle = val.toLowerCase()
            this.filteredRealms = this.realms.filter((realm) => realm.name.toLowerCase().indexOf(needle) > -1)
        })
    }

    get selectedRealm(): number | null {
        return this.realm
    }

    set selectedRealm(realmId: number | null) {
        this.changeRealm(realmId)
    }
}

</script>
