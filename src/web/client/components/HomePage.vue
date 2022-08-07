<script lang="ts" setup>
import { computed } from 'vue'
import { useAuctionsStore } from '../store/Auctions'
import { useLiveAuctions } from '../store/Auctions/useLiveAuctions'
import { useFilterStore } from '../store/Filter'
import { useFilterSyncLocalStorage } from '../store/Filter/useFilterSyncLocalStorage'
import { useFilterSyncQuery } from '../store/Filter/useFilterSyncQuery'
import { APP_NAME, APP_DESC } from '@/common/Constants'
import BoeFilter from './Filters/BoeFilter.vue'
import ItemLevelFilter from './Filters/ItemLevelFilter.vue'
import MaxBuyoutFilter from './Filters/MaxBuyoutFilter.vue'
import RealmFilter from './Filters/RealmFilter.vue'
import RegionFilter from './Filters/RegionFilter.vue'
import SocketFilter from './Filters/SocketFilter.vue'
import TertiaryFilter from './Filters/TertiaryFilter.vue'
import TierFilter from './Filters/TierFilter.vue'
import HomePageAuctionsTable from './HomePageAuctionsTable.vue'
import HomePageFlavorText from './HomePageFlavorText.vue'

useFilterSyncLocalStorage()
useFilterSyncQuery()
useLiveAuctions()

const filterStore = useFilterStore()
const selectedRegion = computed(() => filterStore.region)

const auctionsStore = useAuctionsStore()
const lastUpdateIso = computed(() => auctionsStore.lastUpdateIso)
const lastUpdateString = computed(() => auctionsStore.lastUpdateFull)
const lastUpdateFromNow = computed(() => auctionsStore.lastUpdateFromNow)
</script>

<template>
    <div class="main-layout">
        <header class="shadow-2">
            <div class="logo">
                <q-avatar size="40px">
                    <img src="/token.png" :alt="APP_NAME" width="40" height="40">
                </q-avatar>

                <h1>
                    {{ APP_NAME }}
                </h1>
            </div>

            <div class="filters">
                <RegionFilter />
                <TierFilter />
            </div>
        </header>

        <main>
            <aside>
                <div class="group padded">
                    {{ APP_DESC }}
                </div>

                <template v-if="selectedRegion">
                    <div class="group padded">
                        <strong>Last Update: </strong>
                        <time :datetime="lastUpdateIso" :title="lastUpdateString">{{ lastUpdateFromNow }}</time>
                    </div>

                    <RealmFilter />
                    <BoeFilter />
                    <ItemLevelFilter />
                    <MaxBuyoutFilter />
                    <SocketFilter />
                    <TertiaryFilter />
                </template>
                <template v-else>
                    <q-banner>
                        No region selected
                    </q-banner>
                </template>

                <div class="vspace" />

                <HomePageFlavorText />
            </aside>

            <article>
                <HomePageAuctionsTable />
            </article>
        </main>
    </div>
</template>

<style lang="scss" scoped>
.main-layout{
    display: grid;
    grid-template-rows: auto 1fr;
    min-height: 100vh;

    > header,
    > main{
        display: grid;
        grid-template-columns: minmax($sidebar-min-width, 20%) minmax($sidebar-min-width, 1fr);
        grid-template-rows: 100%;
    }
}

header{
    .logo{
        background: $header;
        display: flex;
        gap: $padding;
        align-items: center;
        padding: $padding $side-padding;

        h1{
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
            line-height: 1;
            margin: 0;
        }
    }

    .filters{
        background-color: $bg-side;
        display: grid;
        grid-template-columns: math.div($sidebar-min-width, 2) 1fr;
        gap: $padding;
        padding: $padding;
    }
}

aside{
    background: $bg-side;
    display: flex;
    flex-direction: column;

    .vspace{
        flex: 1;
    }
}

article{
    position: sticky;
}
</style>
