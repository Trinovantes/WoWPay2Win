<template>
    <main id="main-layout">
        <Header />
        <div class="row col">
            <Sidebar class="col-3" />
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
}
</style>
