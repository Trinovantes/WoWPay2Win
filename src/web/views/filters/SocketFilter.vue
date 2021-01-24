<template>
    <div class="group">
        <q-list>
            <q-item v-ripple tag="label">
                <q-item-section avatar>
                    <q-checkbox
                        v-model="selectedMustHaveSocket"
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

<script lang="ts">
import Component from 'vue-class-component'
import { VuexAccessor } from '@views/mixins/VuexAccessor'

@Component
export default class SocketFilter extends VuexAccessor {
    get selectedMustHaveSocket(): boolean {
        return this.mustHaveSocket
    }

    set selectedMustHaveSocket(mustHaveSocket: boolean) {
        this.changeMustHaveSocket(mustHaveSocket)
    }
}
</script>
