<script lang="ts" setup>
import { QTable } from 'quasar'
import { computed, ref } from 'vue'
import { type Auctions, useAuctionStore } from '../store/Auction/useAuctionStore.ts'
import { useFilterStore } from '../store/Filter/useFilterStore.ts'
import { getItemIcon } from '../utils/ImageLoader.ts'
import { getAuctionHasSocket } from '../utils/getAuctionHasSocket.ts'
import { getAuctionTertiary } from '../utils/getAuctionTertiary.ts'
import { getItemName } from '../utils/getItemName.ts'
import { getConnectedRealmName } from '../utils/getConnectedRealmName.ts'
import { getWowheadItemLinkById } from '../utils/getWowheadItemLinkById.ts'
import type { ItemAuction } from '../../../common/Cache.ts'
import { ROWS_PER_PAGE } from '../../../common/Constants.ts'
import { type Difficulty, type Tertiary, ALL_DIFFICULTIES, ALL_TERTIARIES } from '../../../common/ItemBonusId.ts'
import { tokenPrices, currencyFormatters } from '../../../common/RegionConfig.ts'
import { getAuctionDifficulty } from '../utils/getAuctionDifficulty.ts'

type Pagination = Omit<Required<Required<QTable>['pagination']>, 'rowsNumber'>

const filterStore = useFilterStore()
const filteredRegion = computed(() => filterStore.region)

const auctionsStore = useAuctionStore()
const filteredAuctions = computed(() => auctionsStore.filteredAuctions)
const tableColumns = [
    {
        required: true,
        name: 'colItemId',
        label: 'Item',
        align: 'left',
        sortable: true,
        field: (auction: ItemAuction) => getItemName(filteredRegion.value, auction),
        classes: 'md-col',
        headerClasses: 'md-col',
    },
    {
        required: true,
        name: 'colBuyout',
        label: 'Buyout',
        sortable: true,
        field: (auction: ItemAuction) => auction.buyout,
        classes: 'sm-col',
        headerClasses: 'sm-col',
    },
    {
        name: 'colDifficulty',
        label: 'iLvl',
        sortable: true,
        align: 'left',
        field: (auction: ItemAuction) => getAuctionDifficulty(auction),
        format: (val?: Difficulty) => ALL_DIFFICULTIES.find((d) => d.key === val)?.label,
        classes: 'sm-col',
        headerClasses: 'sm-col',
    },
    {
        name: 'colHasSocket',
        label: 'Has Socket',
        sortable: true,
        align: 'left',
        field: (auction: ItemAuction) => getAuctionHasSocket(auction),
        classes: 'sm-col',
        headerClasses: 'sm-col',
    },
    {
        name: 'colTertiary',
        label: 'Tertiary',
        sortable: true,
        align: 'left',
        field: (auction: ItemAuction) => getAuctionTertiary(auction),
        format: (val?: Tertiary) => ALL_TERTIARIES.find((t) => t.bonusId === val)?.label,
        classes: 'sm-col',
        headerClasses: 'sm-col',
    },
    {
        required: true,
        name: 'colConnectedRealms',
        label: 'Connected Realms',
        align: 'left',
        field: (auction: ItemAuction) => getConnectedRealmName(filteredRegion.value, auction.crId),
    },
] as const satisfies QTable['columns']

type ColumnNames = (typeof tableColumns)[number]['name']

const visibleColumns = computed<Array<ColumnNames>>(() => {
    const columns: Array<ColumnNames> = []

    if (filterStore.enableDifficultyFilter) {
        columns.push('colDifficulty')
    }

    if (filterStore.enableSocketFilter) {
        columns.push('colHasSocket')
    }

    if (filterStore.enableTertiaryFilter) {
        columns.push('colTertiary')
    }

    return columns
})

const sortAuctions = (auctions: Readonly<Auctions>, sortBy: string, descending: boolean) => {
    return [...auctions].sort((a, b) => {
        const compare = (key: ColumnNames, ascending = true) => {
            let comp = 0
            switch (key) {
                case 'colItemId': {
                    const x = getItemName(filteredRegion.value, a)
                    const y = getItemName(filteredRegion.value, b)
                    comp = x.localeCompare(y)
                    break
                }
                case 'colBuyout': {
                    const x = (a.buyout ?? 0)
                    const y = (b.buyout ?? 0)
                    comp = x - y
                    break
                }
                case 'colDifficulty': {
                    const x = getAuctionDifficulty(a) ?? 0
                    const y = getAuctionDifficulty(b) ?? 0
                    comp = x - y
                    break
                }
                case 'colHasSocket': {
                    const x = getAuctionHasSocket(a) ? 1 : 0
                    const y = getAuctionHasSocket(b) ? 1 : 0
                    comp = x - y
                    break
                }
                case 'colTertiary': {
                    const x = getAuctionTertiary(a) ?? 0
                    const y = getAuctionTertiary(b) ?? 0
                    comp = x - y
                    break
                }
            }

            return comp * (ascending ? 1 : -1)
        }

        return (sortBy && compare(sortBy as ColumnNames, !descending)) || compare('colBuyout') || compare('colDifficulty', false) || compare('colItemId') || compare('colHasSocket', false) || compare('colTertiary', false)
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
    sortBy: 'colBuyout',
})

const getWowheadLink = (auction: ItemAuction) => {
    if (filteredRegion.value === null) {
        return ''
    }

    const itemLink = getWowheadItemLinkById(auction.itemId, filteredRegion.value)
    const bonusIds = auction.bonusIds ?? []
    return `${itemLink}&bonus=${bonusIds.join(':')}`
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
        :columns="tableColumns"
        :visible-columns="visibleColumns"
        :sort-method="sortAuctions"
        :no-data-label="noDataLabel"
        hide-pagination
    >
        <template #body-cell-colItemId="props">
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
        <template #body-cell-colBuyout="props: { row: ItemAuction }">
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
        <template #body-cell-colHasSocket="props">
            <q-td :props="props">
                <q-icon
                    v-if="getAuctionHasSocket(props.row)"
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
