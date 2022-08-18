<script lang="ts" setup>
import { QTable } from 'quasar/src/index.all'
import { computed, ref } from 'vue'
import { Auctions, useAuctionsStore } from '../store/Auctions'
import { useFilterStore } from '../store/Filter'
import { getItemIcon } from '../utils/ImageLoader'
import { auctionHasSocket } from '../utils/auctionHasSocket'
import { getAuctionIlvl } from '../utils/getAuctionIlvl'
import { getAuctionTertiary } from '../utils/getAuctionTertiary'
import { getItemNameById } from '../utils/getItemNameById'
import { getItemSecondaryAffix } from '../utils/getItemSecondaryAffix'
import { getRegion } from '../utils/getRegion'
import { getWowheadItemLinkById } from '../utils/getWowheadItemLinkById'
import { Tertiary } from '@/common/BonusId'
import type { ItemAuction } from '@/common/Cache'
import { ROWS_PER_PAGE } from '@/common/Constants'

type Pagination = Omit<Required<Required<QTable>['pagination']>, 'rowsNumber'>

const filterStore = useFilterStore()
const filteredRegion = computed(() => filterStore.region)

const auctionsStore = useAuctionsStore()
const filteredAuctions = computed(() => auctionsStore.filteredAuctions)
const columns: QTable['columns'] = [
    {
        name: 'itemId',
        label: 'Item',
        align: 'left',
        sortable: true,
        field: (auction: ItemAuction) => getItemName(auction),
        classes: 'md-col',
        headerClasses: 'md-col',
    },
    {
        name: 'buyout',
        label: 'Buyout',
        sortable: true,
        field: (auction: ItemAuction) => auction.buyout,
        format: (val: number) => formatNum(val),
        classes: 'sm-col',
        headerClasses: 'sm-col',
    },
    {
        name: 'bonusIlvl',
        label: 'Level',
        sortable: true,
        field: (auction: ItemAuction) => getAuctionIlvl(auction),
        classes: 'sm-col',
        headerClasses: 'sm-col',
    },
    {
        name: 'hasSocket',
        label: 'Has Socket',
        sortable: true,
        align: 'left',
        field: (auction: ItemAuction) => auctionHasSocket(auction),
        classes: 'sm-col',
        headerClasses: 'sm-col',
    },
    {
        name: 'tertiary',
        label: 'Tertiary',
        sortable: true,
        align: 'left',
        field: (auction: ItemAuction) => getAuctionTertiary(auction),
        format: (val?: Tertiary) => val ? Tertiary[val] : '',
        classes: 'sm-col',
        headerClasses: 'sm-col',
    },
    {
        name: 'connectedRealm',
        label: 'Connected Realms',
        align: 'left',
        field: (auction: ItemAuction) => getConnectedRealmName(auction.crId),
    },
]

const sortAuctions = (auctions: Readonly<Auctions>, sortBy: string, descending: boolean) => {
    return [...auctions].sort((a, b) => {
        const compare = (key: string, ascending = true) => {
            let comp = 0
            switch (key) {
                case 'itemId': {
                    const x = getItemName(a)
                    const y = getItemName(b)
                    comp = x.localeCompare(y)
                    break
                }
                case 'buyout': {
                    const x = (a[key] ?? 0)
                    const y = (b[key] ?? 0)
                    comp = x - y
                    break
                }
                case 'bonusIlvl': {
                    const x = getAuctionIlvl(a)
                    const y = getAuctionIlvl(b)
                    comp = x - y
                    break
                }
                case 'hasSocket': {
                    const x = auctionHasSocket(a) ? 1 : 0
                    const y = auctionHasSocket(b) ? 1 : 0
                    comp = x - y
                    break
                }
                case 'tertiary': {
                    const x = getAuctionTertiary(a) ?? 0
                    const y = getAuctionTertiary(b) ?? 0
                    comp = x - y
                    break
                }
            }

            return comp * (ascending ? 1 : -1)
        }

        return (sortBy && compare(sortBy, !descending)) || compare('buyout') || compare('bonusIlvl', false) || compare('itemId') || compare('hasSocket', false) || compare('tertiary', false)
    })
}

const noDataLabel = computed(() => {
    if (!filterStore.region) {
        return 'No region selected'
    }

    if (filterStore.boes.size === 0) {
        return 'No BoE selected'
    }

    return 'No auctions found'
})

const numPages = computed(() => Math.ceil(filteredAuctions.value.length / ROWS_PER_PAGE))
const pagination = ref<Pagination>({
    page: 1,
    rowsPerPage: ROWS_PER_PAGE,
    descending: false,
    sortBy: 'buyout',
})

const getConnectedRealmName = (crId: number): string => {
    if (!filteredRegion.value) {
        return ''
    }

    const region = getRegion(filteredRegion.value)
    if (!region) {
        return ''
    }

    for (const connectedRealm of region.connectedRealms) {
        if (connectedRealm.id === crId) {
            return connectedRealm.realms.map((realm) => realm.name).join(', ')
        }
    }

    return ''
}

const getWowheadLink = (auction: ItemAuction) => {
    if (!filteredRegion.value) {
        return ''
    }

    const itemLink = getWowheadItemLinkById(auction.itemId, filteredRegion.value)
    return `${itemLink}&bonus=${auction.bonuses.join(':')}`
}

const getItemName = (auction: ItemAuction) => {
    if (!filteredRegion.value) {
        return ''
    }

    const itemName = getItemNameById(auction.itemId, filteredRegion.value)
    const affix = getItemSecondaryAffix(auction.bonuses)

    if (affix) {
        return `${itemName} (${affix})`
    } else {
        return itemName
    }
}

const formatNum = (val: number): string => {
    const fmt = new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    })

    return fmt.format(val)
}
</script>

<template>
    <q-table
        v-model:pagination="pagination"
        class="auctions"
        row-key="id"
        :rows="filteredAuctions"
        :columns="columns"
        :sort-method="sortAuctions"
        :no-data-label="noDataLabel"
        hide-pagination
    >
        <template #body-cell-itemId="props">
            <q-td :props="props">
                <a
                    :href="getWowheadLink(props.row)"
                    :data-wowhead="`item=${props.row.itemId}`"
                    class="boe"
                    rel="noopener"
                    target="_blank"
                >
                    <q-avatar
                        rounded
                        size="20px"
                    >
                        <img :src="getItemIcon(props.row.itemId)" :alt="getItemName(props.row)" width="20" height="20">
                    </q-avatar>
                    {{ getItemName(props.row) }}
                </a>
            </q-td>
        </template>
        <template #body-cell-hasSocket="props">
            <q-td :props="props">
                <q-icon
                    v-if="props.row.hasSocket"
                    name="check_circle_outline"
                    title="Has Socket"
                />
            </q-td>
        </template>
    </q-table>

    <q-pagination
        v-if="filteredAuctions.length > 0"
        v-model="pagination.page"
        :max="numPages"
        boundary-links
        direction-links
        input
        color="secondary"
    />
</template>

<style lang="scss" scoped>
.q-pagination{
    justify-content: center;
    padding: $padding;
}
</style>