import { getAllBoeIds } from '@/common/utils'
import { ConnectedRealmData } from '@/common/Data'
import { BnetAuctionsResponse, BnetConnectedRealmResponse } from '@/cron/api/Responses'
import { ApiAccessor } from '@/cron/api/ApiAccessor'
import { ItemAuction } from '@/cron/models/ItemAuctions'
import { Realm } from '@/cron/models/Realm'
import { Region } from '@/cron/models/Region'

// ----------------------------------------------------------------------------
// ConnectedRealm
// ----------------------------------------------------------------------------

export class ConnectedRealm {
    readonly connectedRealmAccessor: ApiAccessor<BnetConnectedRealmResponse>
    readonly auctionsAccessor: ApiAccessor<BnetAuctionsResponse>

    readonly region: Region
    readonly id: number
    readonly realms: Array<Realm>
    readonly auctions: Array<ItemAuction>

    constructor(region: Region, id: number) {
        const connectedRealmEndpoint = `${region.config.apiHost}/data/wow/connected-realm/${id}`
        this.connectedRealmAccessor = new ApiAccessor(connectedRealmEndpoint, true, region)

        const auctionsEndpoint = `${region.config.apiHost}/data/wow/connected-realm/${id}/auctions`
        this.auctionsAccessor = new ApiAccessor(auctionsEndpoint, true, region)

        this.region = region
        this.id = id
        this.realms = []
        this.auctions = []
    }

    export(): ConnectedRealmData {
        const cachedConnectedRealm: ConnectedRealmData = {
            id: this.id,
            realms: [],
        }

        for (const realm of this.realms) {
            cachedConnectedRealm.realms.push(realm.export())
        }

        return cachedConnectedRealm
    }

    async fetch(): Promise<void> {
        const connectedRealmResponse = await this.connectedRealmAccessor.fetch()

        if (connectedRealmResponse) {
            for (const { id, name } of connectedRealmResponse.realms) {
                const realm = new Realm(this.region, id, name)
                this.realms.push(realm)
            }
        }

        console.debug(`Fetched ${this.toString()}`)
    }

    async fetchAuctions(): Promise<void> {
        const errorMessage = `No auctions found for ${this.toString()}`
        const auctionsResponse = await this.auctionsAccessor.fetch((data) => {
            // Sometimes the API returns a malformed 200 response and we need to retry
            if (!data?.auctions) {
                return errorMessage
            }

            return null
        })

        if (!auctionsResponse?.auctions) {
            console.warn(errorMessage)
            return
        }

        const boeIds: Array<number> = getAllBoeIds()
        for (const auctionResponse of auctionsResponse.auctions) {
            const itemId = auctionResponse.item.id
            if (!boeIds.includes(itemId)) {
                continue
            }

            const id = auctionResponse.id
            const buyout = Math.round((auctionResponse.buyout ?? 0) / (100 * 100)) // 1 gold = 100 silver * 100 copper/silver
            const bonuses = auctionResponse.item.bonus_lists || []

            if (buyout > 0) {
                const auction = new ItemAuction(id, this.id, itemId, buyout, bonuses)
                this.auctions.push(auction)
            }
        }

        console.debug(`Saved ${this.auctions.length.toString().padStart(4, ' ')} auctions from ${this.toString()}`)
    }

    toString(): string {
        return `[ConnectedRealm:${this.id.toString().padStart(4, '0')} ${this.region.toString()} ${this.realms.map((realm) => realm.name).join(', ')}]`
    }
}
