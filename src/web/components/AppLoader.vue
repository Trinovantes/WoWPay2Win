<script lang="ts" setup>
import App from './App.vue'
</script>

<template>
    <suspense>
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

<style lang="scss" scoped>
.app-loader{
    align-items: center;
    display: grid;
    justify-content: center;
    min-height: 100vh;
}
</style>
