<template>
    <main id="main-layout">
        <Header />
        <div class="row col">
            <div class="col-3 sidebar-container">
                <div class="sidebar-content">
                    <Sidebar />
                </div>
                <Footer />
            </div>

            <article class="col">
                <router-view />
            </article>
        </div>
    </main>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator'

@Component({
    components: {
        Header: () => import('@views/layouts/Header.vue'),
        Sidebar: () => import('@views/layouts/Sidebar.vue'),
        Footer: () => import('@views/layouts/Footer.vue'),
    },
})
export default class MainLayout extends Mixins(Vue) {
    // nop
}
</script>

<style lang="scss">
#main-layout{
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    .sidebar-container{
        background: $bg-side;
        min-width: $sidebar-min-width;
        max-width: $sidebar-max-width;

        display: flex;
        flex-direction: column;

        .sidebar-content{
            flex: 1;
        }
    }
}
</style>
