<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useFilterStore } from '@/web/store/Filter'
import { getBaseIlvl, getItemAffix, getItemNameById, getRegionData, getWowheadItemLinkById } from '@/web/utils/GameData'
import { getItemIcon } from '@/web/utils/ImageLoader'
import { QTable } from 'quasar'
import { ItemAuctionData } from '@/common/Data'
import { ROWS_PER_PAGE } from '@/common/Constants'
import { Tertiary } from '@/common/BonusId'
import { Auctions, useAuctionsStore } from '@/web/store/Auctions'

type Pagination = Omit<Required<Required<QTable>['pagination']>, 'rowsNumber'>

export default defineComponent({
    setup() {
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
                field: (auction: ItemAuctionData) => getItemName(auction),
                classes: 'md-col',
                headerClasses: 'md-col',
            },
            {
                name: 'buyout',
                label: 'Buyout',
                sortable: true,
                field: (auction: ItemAuctionData) => auction.buyout,
                format: (val: number) => formatNum(val),
                classes: 'sm-col',
                headerClasses: 'sm-col',
            },
            {
                name: 'bonusIlvl',
                label: 'Level',
                sortable: true,
                field: (auction: ItemAuctionData) => getBaseIlvl(auction.itemId) + (auction.bonusIlvl ?? 0),
                classes: 'sm-col',
                headerClasses: 'sm-col',
            },
            {
                name: 'hasSocket',
                label: 'Has Socket',
                sortable: true,
                align: 'left',
                field: (auction: ItemAuctionData) => Boolean(auction.hasSocket),
                classes: 'sm-col',
                headerClasses: 'sm-col',
            },
            {
                name: 'tertiary',
                label: 'Tertiary',
                sortable: true,
                align: 'left',
                field: (auction: ItemAuctionData) => auction.tertiary,
                format: (val?: Tertiary) => val ? Tertiary[val] : '',
                classes: 'sm-col',
                headerClasses: 'sm-col',
            },
            {
                name: 'connectedRealm',
                label: 'Connected Realms',
                align: 'left',
                field: (auction: ItemAuctionData) => getConnectedRealmName(auction.crId),
            },
        ]

        const sortAuctions = (auctions: Auctions, sortBy: string, descending: boolean) => {
            auctions.sort((a, b) => {
                const compare = (key: string, ascending = true) => {
                    let comp = 0
                    switch (key) {
                        case 'itemId': {
                            const x = getItemName(a)
                            const y = getItemName(b)
                            comp = x.localeCompare(y)
                            break
                        }
                        case 'tertiary': {
                            const x = a[key] ? Tertiary[Number(a[key])] : ''
                            const y = b[key] ? Tertiary[Number(b[key])] : ''
                            comp = x.localeCompare(y)
                            break
                        }
                        case 'buyout':
                        case 'bonusIlvl': {
                            const x = (a[key] ?? 0)
                            const y = (b[key] ?? 0)
                            comp = x - y
                            break
                        }
                        case 'hasSocket': {
                            const x = a[key] ? 1 : 0
                            const y = b[key] ? 1 : 0
                            comp = x - y
                            break
                        }
                    }

                    return comp * (ascending ? 1 : -1)
                }

                return (sortBy && compare(sortBy, !descending)) || compare('buyout') || compare('bonusIlvl', false) || compare('itemId') || compare('hasSocket', false)
            })

            return auctions
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

            const regionData = getRegionData(filteredRegion.value)
            if (!regionData) {
                return ''
            }

            for (const connectedRealm of regionData.connectedRealms) {
                if (connectedRealm.id === crId) {
                    return connectedRealm.realms.map((realm) => realm.name).join(', ')
                }
            }

            return ''
        }

        const getWowheadLink = (auction: ItemAuctionData) => {
            if (!filteredRegion.value) {
                return ''
            }

            const itemLink = getWowheadItemLinkById(auction.itemId, filteredRegion.value)
            return `${itemLink}&bonus=${auction.bonuses.join(':')}`
        }
        const getItemName = (auction: ItemAuctionData) => {
            if (!filteredRegion.value) {
                return ''
            }

            const itemName = getItemNameById(auction.itemId, filteredRegion.value)
            const affix = getItemAffix(auction.bonuses)

            if (affix) {
                return `${itemName} (${affix})`
            } else {
                return itemName
            }
        }

        return {
            filteredAuctions,
            columns,
            sortAuctions,
            noDataLabel,
            pagination,
            numPages,

            getWowheadLink,
            getItemIcon,
            getItemName,
        }
    },
})

function formatNum(val: number): string {
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

<style lang="scss">
.auctions{
    th,
    td{
        padding: $padding ($side-padding);

        &.sm-col {
            width: 150px;
        }
        &.md-col {
            width: 400px;
        }
    }

    th{
        font-weight: bold;
    }

    td{
        color: $text;
    }

    a.boe{
        .q-avatar{
            margin-right: $padding;
        }
    }
}

.q-pagination{
    justify-content: center;
    padding: $padding;
}
</style>
