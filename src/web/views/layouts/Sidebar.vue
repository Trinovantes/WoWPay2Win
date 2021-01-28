<template>
    <aside id="sidebar">
        <div class="group">
            <p>
                {{ appDesc }}
            </p>
        </div>

        <div v-if="region">
            <div class="group">
                <p>
                    <strong>Last Update:</strong>
                    <time :datetime="lastUpdateIso" :title="lastUpdateString">{{ lastUpdateFromNow }}</time>
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
    </aside>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { VuexAccessor } from '@views/mixins/VuexAccessor'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

import Constants from '@common/Constants'

@Component({
    components: {
        RealmFilter: () => import('@views/filters/RealmFilter.vue'),
        BoeFilter: () => import('@views/filters/BoeFilter.vue'),
        ItemLevelFilter: () => import('@views/filters/ItemLevelFilter.vue'),
        MaxBuyoutFilter: () => import('@views/filters/MaxBuyoutFilter.vue'),
        SocketFilter: () => import('@views/filters/SocketFilter.vue'),
        TertiaryFilter: () => import('@views/filters/TertiaryFilter.vue'),
    },
})
export default class MainLayout extends Mixins(VuexAccessor) {
    get appDesc(): string {
        return Constants.APP_DESC
    }

    get lastUpdateFromNow(): string {
        if (this.lastUpdate) {
            return dayjs(this.lastUpdate).fromNow()
        } else {
            return 'N/A'
        }
    }

    get lastUpdateIso(): string | null {
        if (this.lastUpdate) {
            return dayjs(this.lastUpdate).toISOString()
        } else {
            return null
        }
    }

    get lastUpdateString(): string | null {
        if (this.lastUpdate) {
            return dayjs(this.lastUpdate).format('ll LT')
        } else {
            return null
        }
    }
}
</script>

<style lang="scss">
aside#sidebar{
    font-size: 17px;

    .group{
        border-bottom: 1px solid $bg-main;
        padding: 0 $side-padding;

        h2{
            color: white;
        }

        .wrapper{
            padding: 0 $padding;
        }
    }

    h2,
    p,
    .q-field,
    .q-slider,
    .q-list,
    .q-btn-group{
        margin: $side-padding 0;
    }

    h2{
        display: flex;
        font-size: 21px;
        font-weight: bold;
        line-height: 30px;
    }

    .q-list{
        margin-left: -$side-padding;
        margin-right: -$side-padding;

        label.q-item{
            padding-left: $side-padding;
            padding-right: $side-padding;
        }

        &:not(.q-list--dense) {
            label.q-item{
                padding-top: $padding;
                padding-bottom: $padding;
            }
        }

        .q-item__section--avatar{
            padding-right: $padding;
        }

        .q-item__label--caption{
            color: #aaa;
            line-height: 1.5em !important;
            margin-top: $padding / 2;
        }
    }

    .q-banner{
        color: $dark;
        padding: $padding $side-padding;
    }
}
</style>
