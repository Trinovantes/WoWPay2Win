<script lang="ts" setup>
import { computed } from 'vue'
import { useFilterStore } from '../../store/Filter'
import { useIsTierCategoryGear } from './useIsTierCategoryGear'

const filterStore = useFilterStore()
const mustHaveSocket = computed<boolean>({
    get() {
        return filterStore.mustHaveSocket
    },
    set(mustHaveSocket) {
        filterStore.mustHaveSocket = mustHaveSocket
    },
})

const { isTierCategoryGear } = useIsTierCategoryGear()
</script>

<template>
    <div
        v-if="isTierCategoryGear"
        class="group vpad"
    >
        <q-list>
            <q-item v-ripple tag="label">
                <q-item-section avatar>
                    <q-checkbox
                        v-model="mustHaveSocket"
                    />
                </q-item-section>
                <q-item-section>
                    <q-item-label>
                        <strong>Must have socket</strong>
                    </q-item-label>
                    <q-item-label caption>
                        This will also filter out gear with guaranteed sockets
                    </q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </div>
</template>
