<template>
    <div class="column">
        <Header />
        <main class="row col">
            <aside id="sidebar" class="col-3">
                <div class="main-sidebar">
                    <div class="group">
                        <p>
                            {{ APP_DESC }}
                        </p>
                    </div>
                    <div v-if="region">
                        <div class="group">
                            <p>
                                <strong>Last Updated:</strong>
                                <time :datetime="lastUpdatedIso" :title="lastUpdatedString">{{ lastUpdated }}</time>
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

import Constants from '@common/Constants'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

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
    readonly APP_DESC = Constants.APP_DESC

    get lastUpdated(): string {
        if (this.lastModified) {
            return dayjs(this.lastModified).fromNow()
        } else {
            return 'N/A'
        }
    }

    get lastUpdatedIso(): string | null {
        if (this.lastModified) {
            return dayjs(this.lastModified).toISOString()
        } else {
            return null
        }
    }

    get lastUpdatedString(): string | null {
        if (this.lastModified) {
            return dayjs(this.lastModified).format('ll LT')
        } else {
            return null
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
