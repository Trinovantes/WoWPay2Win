import Constants, { getBoeIds } from '@common/Constants'
import { IConnectedRealmCache } from '@common/ICache'
import { sleep } from '@common/utils'
import { IAuctionsResponse, IConnectedRealmResponse } from './API'
import { APIAccessor } from './APIAccessor'
import { ItemAuction } from './ItemAuctions'
import { Realm } from './Realm'
import { Region } from './Region'

export class ConnectedRealm {
    readonly connectedRealmAccessor: APIAccessor<IConnectedRealmResponse>
    readonly auctionsAccessor: APIAccessor<IAuctionsResponse>

    readonly region: Region
    readonly id: number
    realms: Array<Realm>
    auctions: Array<ItemAuction>

    constructor(region: Region, id: number) {
        const connectedRealmEndpoint = `${region.config.apiHost}/data/wow/connected-realm/${id}`
        this.connectedRealmAccessor = new APIAccessor(connectedRealmEndpoint, true, region)

        const auctionsEndpoint = `${region.config.apiHost}/data/wow/connected-realm/${id}/auctions`
        this.auctionsAccessor = new APIAccessor(auctionsEndpoint, true, region)

        this.region = region
        this.id = id
        this.realms = []
        this.auctions = []
    }

    export(): IConnectedRealmCache {
        const cachedConnectedRealm: IConnectedRealmCache = {
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

        for (const { id, name } of connectedRealmResponse.realms) {
            const realm = new Realm(this.region, id, name)
            this.realms.push(realm)
        }

        console.debug(`Fetched ${this.toString()}`)
    }

    async fetchAuctions(): Promise<void> {
        // Retry with exponential back-off if server is temporarily unavilable
        for (let attempt = 0; attempt < Constants.MAX_API_RETRIES; attempt++) {
            try {
                const auctionsResponse = await this.auctionsAccessor.fetch()
                if (!auctionsResponse.auctions) {
                    // Sometimes the API returns a malformed 200 response and we need to retry
                    throw new Error(`No auctions found for ${this.toString()}`)
                }

                const boeIds: Array<number> = getBoeIds()
                for (const auctionResponse of auctionsResponse.auctions) {
                    const itemId = auctionResponse.item.id
                    if (!boeIds.includes(itemId)) {
                        continue
                    }

                    const id = auctionResponse.id
                    const buyout = Math.round((auctionResponse.buyout || 0) / (100 * 100)) // 1 gold = 100 silver * 100 copper/silver
                    const bonuses = auctionResponse.item.bonus_lists || []

                    if (buyout > 0) {
                        const auction = new ItemAuction(id, this.id, itemId, buyout, bonuses)
                        this.auctions.push(auction)
                    }
                }

                console.debug(`Saved ${this.auctions.length.toString().padStart(4, ' ')} auctions from ${this.toString()}`)
                return
            } catch (err) {
                const error = err as Error
                const delay = Math.round(Math.exp(attempt) * 1000)

                console.warn(error.message, `Retrying after ${delay}ms`)
                if (Constants.IS_DEV) {
                    console.warn(error.stack)
                }

                await sleep(delay)
            }
        }

        // If after all our attempts, fetching auctions still this ConnectedRealm fails,
        // the script can still proceed and just treat this realm as having 0 auctions until next scheduled run
    }

    toString(): string {
        return `[ConnectedRealm:${this.id.toString().padStart(4, '0')} ${this.region.toString()} ${this.realms.map((realm) => realm.name).join(', ')}]`
    }
}
