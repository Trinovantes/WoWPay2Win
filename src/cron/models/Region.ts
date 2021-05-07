import path from 'path'
import { RegionConfig } from '@/common/Constants'
import { RegionAuctionsData, Data, RegionCache } from '@/common/Data'
import { batchRequests } from '@/cron/utils/batchRequests'
import { BnetRegionResponse } from '@/cron/api/Responses'
import { ApiAccessor } from '@/cron/api/ApiAccessor'
import { ConnectedRealm } from '@/cron/models/ConnectedRealm'
import { Cacheable, saveDataToCache } from '@/cron/models/Cacheable'
import { Realm } from '@/cron/models/Realm'

// ----------------------------------------------------------------------------
// Region (us, eu, tw, kr)
//
// A Region has multiple ConnectedRealms
// A ConnectedRealm has
//  - 1 to N Realms
//  - 0 to N ItemAuctions
// ----------------------------------------------------------------------------

export class Region extends Cacheable {
    readonly regionAccessor: ApiAccessor<BnetRegionResponse>

    readonly config: RegionConfig
    readonly auctionsDir?: string
    readonly connectedRealms: Array<ConnectedRealm>
    accessToken?: string

    constructor(config: RegionConfig, dataDir: string, auctionsDir?: string) {
        super(path.resolve(dataDir, `region-${config.slug}.json`))

        const endpoint = `${config.apiHost}/data/wow/connected-realm/index`
        this.regionAccessor = new ApiAccessor(endpoint, true, this)

        this.config = config
        this.auctionsDir = auctionsDir
        this.connectedRealms = []
    }

    protected import(fileContents: string): boolean {
        const cachedRegion = JSON.parse(fileContents) as RegionCache

        for (const cachedConnectedRealm of cachedRegion.connectedRealms) {
            const connectedRealm = new ConnectedRealm(this, cachedConnectedRealm.id)
            this.connectedRealms.push(connectedRealm)

            for (const cachedRealm of cachedConnectedRealm.realms) {
                const realm = new Realm(this, cachedRealm.id, cachedRealm.name)
                connectedRealm.realms.push(realm)
            }
        }

        return true
    }

    protected export(): Data {
        const cachedRegion: RegionCache = {
            connectedRealms: [],
        }

        for (const connectedRealm of this.connectedRealms) {
            cachedRegion.connectedRealms.push(connectedRealm.export())
        }

        return cachedRegion
    }

    async fetch(): Promise<void> {
        console.info(`Region::fetch ${this.toString()}`)
        this.accessToken = await this.regionAccessor.fetchAccessToken()

        if (await this.loadDataFromCache()) {
            console.debug(`Loaded ${this.connectedRealms.length} realms from ${this.cacheFile}`)
            return
        }

        const regionResponse = await this.regionAccessor.fetch()
        if (regionResponse) {
            await batchRequests(regionResponse.connected_realms.length, async(idx) => {
                const { href } = regionResponse.connected_realms[idx]
                const re = /\/data\/wow\/connected-realm\/(\d+)/
                const matches = re.exec(href)
                if (matches) {
                    const connectedRealm = new ConnectedRealm(this, parseInt(matches[1]))
                    await connectedRealm.fetch()
                    this.connectedRealms.push(connectedRealm)
                }
            })
        }

        console.debug(`Saving ${this.connectedRealms.length} realms to ${this.cacheFile}`)
        await this.saveDataToCache()
    }

    async fetchAuctions(): Promise<void> {
        if (!this.auctionsDir) {
            throw new Error(`${this.toString()} initialized without auctionsDir`)
        }

        console.info(`Region::fetchAuctions ${this.toString()}`)
        await batchRequests(this.connectedRealms.length, async(idx) => {
            const connectedRealm = this.connectedRealms[idx]
            await connectedRealm.fetchAuctions()
        })

        let totalAuctions = 0
        const auctionsCache: RegionAuctionsData = {
            lastUpdate: Date.now(),
            auctions: [],
        }

        for (const connectedRealm of this.connectedRealms) {
            for (const auction of connectedRealm.auctions) {
                totalAuctions += 1
                auctionsCache.auctions.push(auction.export())
            }
        }

        const auctionCacheFile = path.resolve(this.auctionsDir, `auctions-${this.config.slug}.json`)
        console.debug(`Saving ${totalAuctions} auctions to ${auctionCacheFile}`)
        await saveDataToCache(auctionCacheFile, auctionsCache)
    }

    toString(): string {
        return `[Region:${this.config.slug}]`
    }
}
