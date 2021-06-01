<template>
    <div class="sidebar-content">
        <div class="group">
            <p>
                {{ APP_DESC }}
            </p>
        </div>

        <div v-if="selectedRegion">
            <div class="group">
                <p>
                    <strong>Last Update: </strong>
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
        <q-banner v-else>
            <strong>
                No region selected
            </strong>
        </q-banner>
    </div>
</template>

<script lang="ts">
import { APP_DESC, APP_NAME } from '@/common/Constants'
import { useAuctionsStore } from '@/web/store/Auctions'
import { useFilterStore } from '@/web/store/Filter'
import { defineAsyncComponent, defineComponent, computed } from 'vue'
import { AuctionsGetter } from '@/web/store/Auctions/getters'

export default defineComponent({
    components: {
        RealmFilter: defineAsyncComponent(() => import('@/web/components/Filters/RealmFilter.vue')),
        BoeFilter: defineAsyncComponent(() => import('@/web/components/Filters/BoeFilter.vue')),
        ItemLevelFilter: defineAsyncComponent(() => import('@/web/components/Filters/ItemLevelFilter.vue')),
        MaxBuyoutFilter: defineAsyncComponent(() => import('@/web/components/Filters/MaxBuyoutFilter.vue')),
        SocketFilter: defineAsyncComponent(() => import('@/web/components/Filters/SocketFilter.vue')),
        TertiaryFilter: defineAsyncComponent(() => import('@/web/components/Filters/TertiaryFilter.vue')),
    },

    setup() {
        const filterStore = useFilterStore()
        const selectedRegion = computed(() => filterStore.state.region)

        const auctionsStore = useAuctionsStore()
        const lastUpdateIso = computed(() => auctionsStore.getters[AuctionsGetter.LAST_UPDATE_ISO])
        const lastUpdateString = computed(() => auctionsStore.getters[AuctionsGetter.LAST_UPDATE_STRING])
        const lastUpdateFromNow = computed(() => auctionsStore.getters[AuctionsGetter.LAST_UPDATE_FROM_NOW])

        return {
            APP_NAME,
            APP_DESC,

            selectedRegion,
            lastUpdateIso,
            lastUpdateString,
            lastUpdateFromNow,
        }
    },
})
</script>

<style lang="scss">
.sidebar-content{
    flex: 1;

    .group{
        border-bottom: 1px solid $bg-main;
        padding: 0 $side-padding;

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
        color: white;
        display: flex;
        font-size: 1.25rem;
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
            line-height: $line-height !important;
            margin-top: math.div($padding, 2);
        }
    }

    .q-banner{
        background: $warning;
        color: $dark;
        padding: $padding $side-padding;
    }
}
</style>
