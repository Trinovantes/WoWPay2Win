<template>
    <header id="header" class="row shadow-2">
        <q-toolbar>
            <q-avatar
                size="40px"
            >
                <img src="/token.png" :alt="APP_NAME" width="40" height="40">
            </q-avatar>
            <h1 class="title">
                {{ APP_NAME }}
            </h1>
        </q-toolbar>

        <q-toolbar class="filters">
            <RegionFilter />
            <TierFilter />
        </q-toolbar>
    </header>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue'
import { APP_NAME } from '@/common/Constants'

export default defineComponent({
    components: {
        RegionFilter: defineAsyncComponent(() => import('@/web/components/Filters/RegionFilter.vue')),
        TierFilter: defineAsyncComponent(() => import('@/web/components/Filters/TierFilter.vue')),
    },
    setup() {
        return {
            APP_NAME,
        }
    },
})
</script>

<style lang="scss">
header#header{
    background: $header;

    .q-toolbar{
        padding-left: $side-padding;
        padding-right: $side-padding;
    }

    h1{
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        line-height: 1;
        margin: 0;
        padding: 0 $padding;
    }

    .filters{
        background-color: $bg-side;
        display: grid;
        grid-template-columns: math.div($sidebar-min-width, 2) 1fr;
        gap: $padding;
        padding: $padding;
    }
}
</style>
