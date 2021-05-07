<template>
    <div class="main-layout">
        <Header class="layout-row" />

        <div class="layout-row">
            <aside class="sidebar">
                <Sidebar />
                <Footer />
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
import Header from '@/web/components/MainLayout/Header.vue'
import Footer from '@/web/components/MainLayout/Footer.vue'
import Sidebar from '@/web/components/MainLayout/Sidebar.vue'

export default defineComponent({
    components: {
        Header,
        Footer,
        Sidebar,
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
