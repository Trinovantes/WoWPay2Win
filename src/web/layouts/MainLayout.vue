<template>
    <div class="main-layout">
        <MainLayoutHeader class="layout-row" />

        <div class="layout-row">
            <aside class="sidebar">
                <MainLayoutSidebar />
                <MainLayoutFooter />
            </aside>

            <main>
                <div class="sticky">
                    <router-view />
                </div>
            </main>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MainLayoutHeader from './MainLayoutHeader.vue'
import MainLayoutFooter from './MainLayoutFooter.vue'
import MainLayoutSidebar from './MainLayoutSidebar.vue'

export default defineComponent({
    components: {
        MainLayoutHeader,
        MainLayoutFooter,
        MainLayoutSidebar,
    },
})
</script>

<style lang="scss">
.main-layout{
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    > *:last-child{
        flex: 1;
    }

    .layout-row{
        display: grid;
        grid-template-columns: minmax($sidebar-min-width, 20%) minmax($sidebar-min-width, 1fr);
        grid-template-rows: 100%;
    }

    aside.sidebar{
        background: $bg-side;
        display: flex;
        flex-direction: column;
    }

    .sticky{
        position: sticky;
        top: 0;
    }
}
</style>
