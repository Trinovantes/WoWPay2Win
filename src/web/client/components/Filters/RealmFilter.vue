<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useFilterStore } from '../../store/Filter'
import { getRegion } from '../../utils/getRegion'
import type { Realm } from '@/common/Cache'

type SelectedRealms = Array<number>
type Realms = Array<Realm>

const filterStore = useFilterStore()
const selectedRealms = computed<SelectedRealms>({
    get() {
        return [...filterStore.realms]
    },
    set(realms) {
        filterStore.realms = new Set(realms)
    },
})

const region = computed(() => filterStore.region)
const regionRealms = computed<Realms>(() => {
    if (region.value === null) {
        return []
    }

    const regionData = getRegion(region.value)
    if (!regionData) {
        return []
    }

    const realms: Realms = []
    const connectedRealms = regionData.connectedRealms
    for (const connectedRealm of connectedRealms) {
        for (const realm of connectedRealm.realms) {
            realms.push(realm)
        }
    }

    return realms.sort((a, b) => a.name.localeCompare(b.name))
})

const filteredRealms = ref<Realms>(regionRealms.value)
const filterFn = (val: string, doneFn: (callbackFn: () => void) => void): void => {
    doneFn(() => {
        const needle = val.toLowerCase()
        filteredRealms.value = regionRealms.value.filter((realm) => realm.name.toLowerCase().indexOf(needle) > -1)
    })
}
</script>

<template>
    <div class="group padded">
        <h2>
            {{ region?.toUpperCase() }} Realm Filter
        </h2>

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
