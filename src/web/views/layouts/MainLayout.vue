<template>
    <main id="main-layout">
        <Header />
        <div class="row col">
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
        </div>
    </main>
</template>

<script lang="ts">
import { VuexAccessor } from '@views/mixins/VuexAccessor'
import Component, { mixins } from 'vue-class-component'

import Constants from '@common/Constants'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

@Component({
    components: {
        Header: () => import('@views/layouts/Header.vue'),
        Footer: () => import('@views/layouts/Footer.vue'),

        RealmFilter: () => import('@views/filters/RealmFilter.vue'),
        BoeFilter: () => import('@views/filters/BoeFilter.vue'),
        ItemLevelFilter: () => import('@views/filters/ItemLevelFilter.vue'),
        MaxBuyoutFilter: () => import('@views/filters/MaxBuyoutFilter.vue'),
        SocketFilter: () => import('@views/filters/SocketFilter.vue'),
        TertiaryFilter: () => import('@views/filters/TertiaryFilter.vue'),
    },
})
export default class MainLayout extends mixins(VuexAccessor) {
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
html,
body,
#app,
#main-layout{
    min-height: 100vh;
}

#main-layout{
    display: flex;
    flex-direction: column;

    #sidebar{
        background: $bg-side;
        min-width: $sidebar-min-width;
        max-width: $sidebar-max-width;

        display: flex;
        flex-direction: column;

        .main-sidebar{
            flex: 1;
        }
    }
}
</style>
