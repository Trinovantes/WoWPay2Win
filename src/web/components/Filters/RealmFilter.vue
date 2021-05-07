<template>
    <div class="group">
        <h2>{{ region.toUpperCase() }} Realm Filter</h2>
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
import { RealmData } from '@/common/Data'
import { useFilterStore } from '@/web/store/Filter'
import { FilterMutation } from '@/web/store/Filter/mutations'
import { computed, defineComponent, ref } from 'vue'
import { getRegionData } from '@/web/utils/GameData'

type SelectedRealms = Array<number>
type Realms = Array<RealmData>

export default defineComponent({
    setup() {
        const filterStore = useFilterStore()
        const selectedRealms = computed<SelectedRealms>({
            get() {
                return [...filterStore.state.realms]
            },
            set(realms) {
                filterStore.commit(FilterMutation.SET_REALMS, new Set(realms))
            },
        })

        const region = computed(() => filterStore.state.region)
        const regionRealms = computed<Realms>(() => {
            if (!region.value) {
                return []
            }

            const regionData = getRegionData(region.value)
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

        return {
            region,
            selectedRealms,
            filteredRealms,
            filterFn,
        }
    },
})
</script>
