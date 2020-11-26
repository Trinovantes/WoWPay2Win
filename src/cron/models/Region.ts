import path from 'path'
import { existsSync, mkdirSync } from 'fs'

import { RegionConfig } from '@common/Constants'
import { IAuctionsCache, ICache, IRegionCache } from '@common/ICache'
import { batchRequests } from '@common/utils'
import { IRegionResponse } from './API'
import { APIAccessor } from './APIAccessor'
import { ConnectedRealm } from './ConnectedRealm'
import { Cacheable } from './Cacheable'
import { Realm } from './Realm'

export class Region extends Cacheable {
    readonly regionAccessor: APIAccessor<IRegionResponse>

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
        await this.saveToCache()
    }

    async fetchAuctions(): Promise<void> {
        const auctionsDir = process.env.AUCTIONS_DIR
        if (!auctionsDir) {
            throw new Error('Cannot find AUCTIONS_DIR in env')
        }
        if (!existsSync(auctionsDir)) {
            console.debug('AUCTIONS_DIR does not exist. Attempting to mkdir', auctionsDir)
            mkdirSync(auctionsDir, { recursive: true })
        }

        console.info(`Region::fetchAuctions ${this.toString()}`)
        await batchRequests(this.connectedRealms.length, async(idx) => {
            const connectedRealm = this.connectedRealms[idx]
            await connectedRealm.fetchAuctions()
        })

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

        const auctionCacheFile = path.resolve(auctionsDir, `auctions-${this.config.slug}.json`)
        console.debug(`Saving ${totalAuctions} auctions to ${auctionCacheFile}`)
        await Cacheable.saveToCache(auctionCacheFile, auctionsCache)
    }

    toString(): string {
        return `[Region:${this.config.slug}]`
    }
}
