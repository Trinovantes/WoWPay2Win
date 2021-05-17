<template>
    <suspense
        @resolve="onResolve"
    >
        <template #default>
            <App />
        </template>
        <template #fallback>
            <div class="app-loader">
                <q-spinner
                    color="primary"
                    size="xl"
                />
            </div>
        </template>
    </suspense>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import App from './App.vue'

export default defineComponent({
    components: {
        App,
    },

    props: {
        onResolve: {
            type: Function as PropType<() => void>,
            default: () => {
                // nop
            },
        },
    },
})
</script>

<style lang="scss">
.app-loader{
    align-items: center;
    display: grid;
    justify-content: center;
    min-height: 100vh;
}
</style>
