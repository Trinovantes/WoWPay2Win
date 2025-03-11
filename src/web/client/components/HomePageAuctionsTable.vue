<script lang="ts" setup>
import { QTable } from 'quasar'
import { computed, ref } from 'vue'
import { Auctions, useAuctionsStore } from '../store/Auctions'
import { useFilterStore } from '../store/Filter'
import { getItemIcon } from '../utils/ImageLoader'
import { auctionHasSocket } from '../utils/auctionHasSocket'
import { getAuctionIlvl } from '../utils/getAuctionIlvl'
import { getAuctionTertiary } from '../utils/getAuctionTertiary'
import { getItemName } from '../utils/getItemName'
import { getConnectedRealmName } from '../utils/getConnectedRealmName'
import { getWowheadItemLinkById } from '../utils/getWowheadItemLinkById'
import { ALL_TERTIARIES, Tertiary } from '@/common/BonusId'
import { ItemAuction } from '@/common/Cache'
import { ROWS_PER_PAGE } from '@/common/Constants'
import { currencyFormatters, tokenPrices } from '@/common/RegionConfig'

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
        field: (auction: ItemAuction) => getItemName(filteredRegion.value, auction),
        classes: 'md-col',
        headerClasses: 'md-col',
    },
    {
        name: 'buyout',
        label: 'Buyout',
        sortable: true,
        field: (auction: ItemAuction) => auction.buyout,
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
        format: (val?: Tertiary) => ALL_TERTIARIES.find((t) => t.bonusId === val)?.label,
        classes: 'sm-col',
        headerClasses: 'sm-col',
    },
    {
        name: 'connectedRealm',
        label: 'Connected Realms',
        align: 'left',
        field: (auction: ItemAuction) => getConnectedRealmName(filteredRegion.value, auction.crId),
    },
]

const sortAuctions = (auctions: Readonly<Auctions>, sortBy: string, descending: boolean) => {
    return [...auctions].sort((a, b) => {
        const compare = (key: string, ascending = true) => {
            let comp = 0
            switch (key) {
                case 'itemId': {
                    const x = getItemName(filteredRegion.value, a)
                    const y = getItemName(filteredRegion.value, b)
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
    if (filterStore.region === null) {
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

const getWowheadLink = (auction: ItemAuction) => {
    if (filteredRegion.value === null) {
        return ''
    }

    const itemLink = getWowheadItemLinkById(auction.itemId, filteredRegion.value)
    return `${itemLink}&bonus=${auction.bonuses.join(':')}`
}

const numFormatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
})
const fractionFormatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})

const getBuyoutTooltip = (val: number): string => {
    const region = filterStore.region
    if (region === null) {
        return ''
    }

    if (auctionsStore.tokenPrice === undefined) {
        return ''
    }

    const numTokens = val / auctionsStore.tokenPrice
    const localCurrency = numTokens * (tokenPrices.get(region) ?? 0)
    if (!(localCurrency > 0)) {
        return ''
    }

    const currencyFormatter = currencyFormatters.get(region)
    if (!currencyFormatter) {
        return ''
    }

    const formatedNumTokens = fractionFormatter.format(numTokens)
    const formatedCurrency = currencyFormatter.format(localCurrency)

    return `${formatedNumTokens} ${numTokens === 1 ? 'Token' : 'Tokens'} (${formatedCurrency})`
}
</script>

<template>
    <q-table
        v-model:pagination="pagination"
        class="no-shadow no-border-radius"
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
                        <img
                            :src="getItemIcon(props.row.itemId)"
                            :alt="getItemName(filteredRegion, props.row)"
                            width="20"
                            height="20"
                        >
                    </q-avatar>
                    {{ getItemName(filteredRegion, props.row) }}
                </a>
            </q-td>
        </template>
        <template #body-cell-buyout="props: { row: ItemAuction }">
            <q-td :props="props">
                {{ numFormatter.format(props.row.buyout) }}

                <q-tooltip
                    anchor="center right"
                    self="center left"
                    :offset="[0, 0]"
                >
                    {{ getBuyoutTooltip(props.row.buyout) }}
                </q-tooltip>
            </q-td>
        </template>
        <template #body-cell-hasSocket="props">
            <q-td :props="props">
                <q-icon
                    v-if="auctionHasSocket(props.row)"
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
