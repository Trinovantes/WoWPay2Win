import path from 'path'
import { existsSync, mkdirSync } from 'fs'

import Constants, { RegionConfig } from '@common/Constants'
import { IRegionResponse } from './API'
import { APIAccessor } from './APIAccessor'
import { ConnectedRealm } from './ConnectedRealm'
import { IAuctionsCache, ICache, IRegionCache } from '@common/ICache'
import { Cacheable } from './Cacheable'
import { Realm } from './Realm'

export class Region extends Cacheable {
    readonly regionAccessor: APIAccessor

    readonly config: RegionConfig
    connectedRealms: Array<ConnectedRealm>
    accessToken?: string

    constructor(config: RegionConfig) {
        super(`region-${config.slug}.json`)

        const endpoint = `${config.apiHost}/data/wow/connected-realm/index`
        this.regionAccessor = new APIAccessor(endpoint, true, this)

        this.config = config
        this.connectedRealms = []
    }

    protected import(fileContents: string): boolean {
        const cachedRegion = JSON.parse(fileContents) as IRegionCache

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

    protected export(): ICache {
        const cachedRegion: IRegionCache = {
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

        if (await this.loadFromCache()) {
            console.debug(`Loaded ${this.connectedRealms.length} realms from ${this.cacheFile}`)
            return
        }

        await this.regionAccessor.fetch(this.onReceiveData)

        console.debug(`Saving ${this.connectedRealms.length} realms to ${this.cacheFile}`)
        await this.saveToCache()
    }

    async fetchAuctions(): Promise<void> {
        const dataDir = process.env.DATA_DIR
        if (!dataDir) {
            throw new Error('Cannot find DATA_DIR in env')
        }
        if (!existsSync(dataDir)) {
            console.debug('DATA_DIR does not exist. Attempting to mkdir', dataDir)
            mkdirSync(dataDir, { recursive: true })
        }

        console.info(`Region::fetchAuctions ${this.toString()}`)
        this.accessToken = await this.regionAccessor.fetchAccessToken()

        let offset = 0
        const numCr = this.connectedRealms.length
        while (offset < numCr) {
            const queuedRequests: Array<Promise<void>> = []

            for (let i = 0; i < Constants.CONCURRENT_API_REQUESTS; i++) {
                const crIdx = offset + i
                if (crIdx >= numCr) {
                    break
                }

                const connectedRealm = this.connectedRealms[crIdx]
                queuedRequests.push(connectedRealm.fetchAuctions())
            }

            await Promise.all(queuedRequests)
            offset += Constants.CONCURRENT_API_REQUESTS
        }

        let totalAuctions = 0
        const auctionsCache: IAuctionsCache = {
            lastModified: Date.now(),
            auctions: [],
        }

        for (const connectedRealm of this.connectedRealms) {
            for (const auction of connectedRealm.auctions) {
                totalAuctions += 1
                auctionsCache.auctions.push(auction.export())
            }
        }

        const auctionCacheFile = path.resolve(dataDir, `auctions-${this.config.slug}.json`)
        console.debug(`Saving ${totalAuctions} auctions to ${auctionCacheFile}`)
        await Cacheable.saveToCache(auctionCacheFile, auctionsCache)
    }

    private onReceiveData = async(response: unknown): Promise<void> => {
        const data = response as IRegionResponse

        for (const { href } of data.connected_realms) {
            const re = /\/data\/wow\/connected-realm\/(\d+)/
            const matches = re.exec(href)

            if (matches) {
                const connectedRealm = new ConnectedRealm(this, parseInt(matches[1]))
                await connectedRealm.fetch()
                this.connectedRealms.push(connectedRealm)
            }
        }
    }

    toString(): string {
        return `Region:${this.config.locale}`
    }
}
