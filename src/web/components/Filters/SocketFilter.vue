<script lang="ts">
import { useFilterStore } from '@/web/store/Filter'
import { computed, defineComponent } from 'vue'

export default defineComponent({
    setup() {
        const filterStore = useFilterStore()
        const mustHaveSocket = computed<boolean>({
            get() {
                return filterStore.mustHaveSocket
            },
            set(mustHaveSocket) {
                filterStore.mustHaveSocket = mustHaveSocket
            },
        })

        return {
            mustHaveSocket,
        }
    },
})
</script>

<template>
    <div class="group">
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
                        This option does not include gear with guaranteed sockets
                    </q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </div>
</template>
