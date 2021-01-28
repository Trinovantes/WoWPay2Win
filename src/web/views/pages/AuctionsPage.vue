<template>
    <div class="auctions">
        <q-table
            :data="filteredAuctions"
            row-key="id"
            :columns="columns"
            :sort-method="customSort"
            hide-pagination
            :pagination.sync="pagination"
            :no-data-label="noDataLabel"
        >
            <template #body-cell-itemId="props">
                <q-td :props="props">
                    <a
                        :href="getWowheadItemLink(props.row, region)"
                        :data-wowhead="`item=${props.row.itemId}`"
                        class="boe"
                        rel="noopener"
                        target="_blank"
                    >
                        <q-avatar
                            rounded
                            size="20px"
                        >
                            <img :src="getItemIcon(props.row.itemId)" :alt="getItemName(props.row.itemId)" width="20" height="20">
                        </q-avatar>
                        {{ getItemName(props.row.itemId) }}
                    </a>
                </q-td>
            </template>
            <template #body-cell-hasSocket="props">
                <q-td :props="props">
                    <q-icon
                        v-if="props.row.hasSocket"
                        name="check_circle_outline"
                    />
                </q-td>
            </template>
        </q-table>
        <q-pagination
            v-model="pagination.page"
            :max="numPages"
            boundary-links
            direction-links
            input
            color="secondary"
        />
    </div>
</template>

<script lang="ts">
import { Component, Watch, Mixins } from 'vue-property-decorator'
import { VuexAccessor } from '@views/mixins/VuexAccessor'
import { GameDataAccessor } from '@views/mixins/GameDataAccessor'
import { ImageLoader } from '@views/mixins/ImageLoader'
import { Formatter } from '@views/mixins/Formatter'

import axios from 'axios'

import { IAuctionsCache, IItemAuctionCache } from '@common/ICache'
import Constants, { getTierBoeIds } from '@common/Constants'
import { Tertiary } from '@common/Bonuses'

@Component
export default class AuctionsPage extends Mixins(VuexAccessor, GameDataAccessor, ImageLoader, Formatter) {
    pagination = {
        page: 1,
        rowsPerPage: Constants.ROWS_PER_PAGE,
        descending: false,
        sortBy: 'buyout',
    }

    readonly columns = [
        {
            name: 'itemId',
            label: 'Item',
            align: 'left',
            sortable: true,
            field: (auction: IItemAuctionCache): string => this.getItemName(auction.itemId),
            classes: 'md-col',
            headerClasses: 'md-col',
        },
        {
            name: 'buyout',
            label: 'Buyout',
            sortable: true,
            field: (auction: IItemAuctionCache): number => auction.buyout,
            format: (val: number): string => this.formatNum(val),
            classes: 'sm-col',
            headerClasses: 'sm-col',
        },
        {
            name: 'bonusIlvl',
            label: 'Level',
            sortable: true,
            field: (auction: IItemAuctionCache): number => this.getBaseIlvl(auction.itemId) + (auction.bonusIlvl || 0),
            classes: 'sm-col',
            headerClasses: 'sm-col',
        },
        {
            name: 'hasSocket',
            label: 'Has Socket',
            sortable: true,
            align: 'left',
            field: (auction: IItemAuctionCache): boolean => Boolean(auction.hasSocket),
            format: (val: boolean): string => val ? 'Socket' : '',
            classes: 'sm-col',
            headerClasses: 'sm-col',
        },
        {
            name: 'tertiary',
            label: 'Tertiary',
            sortable: true,
            align: 'left',
            field: (auction: IItemAuctionCache): number | undefined => auction.tertiary,
            format: (val: number | undefined): string => val ? Tertiary[val] : '',
            classes: 'sm-col',
            headerClasses: 'sm-col',
        },
        {
            name: 'connectedRealm',
            label: 'Connected Realms',
            align: 'left',
            field: (auction: IItemAuctionCache): string => this.getConnectedRealmName(auction.crId),
        },
    ]

    customSort(auctions: Array<IItemAuctionCache>, sortBy?: string, descending?: boolean): Array<IItemAuctionCache> {
        const sortedAuctions = [...auctions]

        sortedAuctions.sort((a, b) => {
            const compare = (key: string, ascending = true) => {
                let comp = 0

                switch (key) {
                    case 'itemId': {
                        const x = this.getItemName(a[key])
                        const y = this.getItemName(b[key])
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
                        const x = (a[key] || 0)
                        const y = (b[key] || 0)
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

        return sortedAuctions
    }

    auctions: Array<IItemAuctionCache> = []

    created(): void {
        void this.fetchAuctions()
    }

    @Watch('region')
    @Watch('tier')
    async fetchAuctions(): Promise<void> {
        this.changeLastUpdate(null)
        this.auctions = []

        if (!this.region) {
            return
        }

        if (!DEFINE.AUCTIONS_URL) {
            throw new Error('DEFINE.AUCTIONS_URL is not set by the preprocessor')
        }

        const auctionsFile = `${DEFINE.AUCTIONS_URL}/auctions-${this.region}.json`
        const response = await axios.get(auctionsFile)
        const auctionsCache = response.data as IAuctionsCache

        this.changeLastUpdate(auctionsCache.lastUpdate)
        this.auctions = auctionsCache.auctions
    }

    get filteredAuctions(): Array<IItemAuctionCache> {
        if (this.tier === null) {
            return []
        }

        const tierBoes = getTierBoeIds(this.tier)

        return this.auctions.filter((auction) => {
            // Skip BoEs not from this tier
            if (!tierBoes.includes(auction.itemId)) {
                return false
            }

            // Only selected BoEs
            if (!this.boes.has(auction.itemId)) {
                return false
            }

            const ilvl = this.getBaseIlvl(auction.itemId) + (auction.bonusIlvl || 0)
            if (ilvl < this.ilvlRange.min || ilvl > this.ilvlRange.max) {
                return false
            }

            if (auction.buyout > this.maxBuyout) {
                return false
            }

            if (this.mustHaveSocket && !auction.hasSocket) {
                return false
            }

            if (this.tertiaries.size > 0 && (!auction.tertiary || !this.tertiaries.has(auction.tertiary))) {
                return false
            }

            if (this.realms.size > 0) {
                const connectedRealms = new Set<number>()
                for (const realm of this.realms) {
                    connectedRealms.add(this.realmToConnectedRealmMap[realm])
                }

                if (!connectedRealms.has(auction.crId)) {
                    return false
                }
            }

            return true
        })
    }

    get numPages(): number {
        return Math.ceil(this.filteredAuctions.length / this.pagination.rowsPerPage)
    }

    get noDataLabel(): string {
        if (!this.region) {
            return 'No region selected'
        }

        if (!this.boes.size) {
            return 'No BoE selected'
        }

        return 'No auctions found'
    }
}
</script>

<style lang="scss">
.auctions{
    position: sticky;
    top: 0;

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
    margin: $padding;
}
</style>
