<template>
    <div class="column">
        <Header />
        <main class="row col">
            <aside id="sidebar" class="col-3">
                <div class="main-sidebar">
                    <div class="group">
                        <p>
                            This tool scans for BoEs in every auction house across the region. To buy an item, you need to either transfer a character with gold or buy tokens on that realm.
                        </p>
                    </div>
                    <div v-if="region">
                        <div class="group">
                            <p>
                                <strong>Last Updated:</strong> {{ lastUpdated }}
                            </p>
                        </div>
                        <RealmFilter />
                        <BoeFilter />
                        <ItemLevelFilter />
                        <MaxBuyoutFilter />
                        <SocketFilter />
                        <TertiaryFilter />
                    </div>
                    <q-banner
                        v-else
                        class="bg-warning"
                    >
                        No region selected
                    </q-banner>
                </div>
                <Footer />
            </aside>
            <article class="col">
                <router-view />
            </article>
        </main>
    </div>
</template>

<script lang="ts">
import VuexComponent from './base/VuexComponent'
import Component from 'vue-class-component'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

@Component({
    components: {
        Header: () => import('@components/Header.vue'),
        Footer: () => import('@components/Footer.vue'),

        RealmFilter: () => import('@components/filters/RealmFilter.vue'),
        BoeFilter: () => import('@components/filters/BoeFilter.vue'),
        ItemLevelFilter: () => import('@components/filters/ItemLevelFilter.vue'),
        MaxBuyoutFilter: () => import('@components/filters/MaxBuyoutFilter.vue'),
        SocketFilter: () => import('@components/filters/SocketFilter.vue'),
        TertiaryFilter: () => import('@components/filters/TertiaryFilter.vue'),
    },
})
export default class MainLayout extends VuexComponent {
    get lastUpdated(): string {
        if (this.lastModified) {
            return dayjs(this.lastModified).fromNow()
        } else {
            return 'N/A'
        }
    }
}
</script>

<style lang="scss">
#sidebar{
    background: $bg-side;
    min-width: $sidebar-min-width;
    max-width: $sidebar-max-width;

    display: flex;
    flex-flow: column;

    .main-sidebar{
        flex: 1;
    }
}
</style>
