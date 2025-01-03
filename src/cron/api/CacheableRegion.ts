import path from 'node:path'
import { getProcessMemoryStats } from '../utils/getProcessMemoryStats'
import { hasBannedId } from '@/common/BonusId'
import type { ConnectedRealm, Region, RegionAuctions } from '@/common/Cache'
import { convertCopperToGold } from '@/common/utils/convertCopperToGold'
import { Cacheable } from './Cacheable'
import type { ApiAccessor } from '../api/ApiAccessor'
import type { BnetAuctionsResponse, BnetConnectedRealmResponse, BnetRegionResponse, BnetTokenResponse } from '../api/BnetResponse'
import { getAllBoeIds } from '@/common/Boe'

// ----------------------------------------------------------------------------
// Region (us, eu, tw, kr)
//
// A Region has multiple ConnectedRealms
// A ConnectedRealm has
//  - 1 to N Realms
//  - 0 to N ItemAuctions
// ----------------------------------------------------------------------------

export class CacheableRegion extends Cacheable<Region> {
    readonly auctionsDir: string
    #connectedRealms: Array<ConnectedRealm>

    constructor(apiAccessor: ApiAccessor, dataDir: string, auctionsDir: string) {
        super(apiAccessor, path.resolve(dataDir, `region-${apiAccessor.regionConfig.slug}.json`))

        this.auctionsDir = auctionsDir
        this.#connectedRealms = []
    }

    override toString(): string {
        return `[CacheableRegion:${this.apiAccessor.regionConfig.slug}]`
    }

    get regionEndpoint(): string {
        return '/data/wow/connected-realm/index'
    }

    get slug(): string {
        return this.apiAccessor.regionConfig.slug
    }

    protected import(fileContents: string): boolean {
        const cachedRegion = JSON.parse(fileContents) as Region

        this.#connectedRealms = cachedRegion.connectedRealms

        return true
    }

    protected export(): Region {
        const region: Region = {
            connectedRealms: this.#connectedRealms,
        }

        return region
    }

    async fetch(): Promise<void> {
        console.info(`CacheableRegion::fetch ${this.toString()}`)

        if (await this.loadDataFromCache()) {
            console.info(`Loaded ${this.#connectedRealms.length} realms from ${this.cacheFile}`)
            return
        }

        const regionResponse = await this.apiAccessor.fetch<BnetRegionResponse>(this.regionEndpoint, true, (res) => {
            if (!res?.connected_realms) {
                return 'Missing connected_realms in response'
            }

            return null
        })

        if (!regionResponse) {
            console.warn(`Failed to fetch region data ${this.toString()}`)
            return
        }

        for (const cr of regionResponse.connected_realms) {
            const re = /\/data\/wow\/connected-realm\/(\d+)/
            const matches = re.exec(cr.href)
            if (!matches) {
                return
            }

            const crId = parseInt(matches[1])
            const endpoint = `/data/wow/connected-realm/${crId}`
            const crResponse = await this.apiAccessor.fetch<BnetConnectedRealmResponse>(endpoint, true, (res) => {
                if (!res?.realms) {
                    return 'Missing realms in response'
                }

                return null
            })

            this.#connectedRealms.push({
                id: crId,
                realms: crResponse?.realms ?? [],
            })
        }

        console.info(`Saving ${this.#connectedRealms.length} realms to ${this.cacheFile}`)
        await this.saveDataToCache()
    }

    async fetchAuctions() {
        console.info(`CacheableRegion::fetchAuctions ${this.toString()}`)

        const tokenEndpoint = '/data/wow/token/index'
        const tokenResponse = await this.apiAccessor.fetch<BnetTokenResponse>(tokenEndpoint, true, (res) => {
            if (res?.price === undefined) {
                return 'Missing price in response'
            }

            return null
        })

        const tokenPrice = convertCopperToGold(tokenResponse?.price ?? 0)
        const regionAuctions: RegionAuctions = {
            lastUpdate: Date.now(),
            tokenPrice,
            auctions: [],
        }

        const idxPad = Math.ceil(Math.log10(this.#connectedRealms.length))

        for (const [idx, cr] of this.#connectedRealms.entries()) {
            const crId = cr.id
            const crStr = `${this.toString()} [ConnectedRealm:${crId.toString().padStart(4, '0')} ${cr.realms.map((realm) => realm.name).join(', ')}]`

            const auctionsEndpoint = `/data/wow/connected-realm/${crId}/auctions`
            const auctionsResponse = await this.apiAccessor.fetch<BnetAuctionsResponse>(auctionsEndpoint, true, (res) => {
                // Sometimes the API returns a malformed 200 response and we need to retry
                if (!res?.auctions) {
                    return `No auctions found for ${crStr}`
                }

                return null
            })

            const boeIds = getAllBoeIds()
            let numCrAuctions = 0

            for (const auctionResponse of auctionsResponse?.auctions ?? []) {
                const itemId = auctionResponse.item.id
                if (!boeIds.includes(itemId)) {
                    continue
                }

                const buyout = convertCopperToGold(auctionResponse.buyout ?? 0)
                if (buyout === 0) {
                    continue
                }

                const id = auctionResponse.id
                const bonuses = auctionResponse.item.bonus_lists ?? []
                if (hasBannedId(bonuses)) {
                    continue
                }

                numCrAuctions += 1
                regionAuctions.auctions.push({
                    bonuses,
                    crId,
                    buyout,
                    id,
                    itemId,
                })
            }

            console.info(`[${(idx + 1).toString().padStart(idxPad, '0')}/${this.#connectedRealms.length}] ${crStr} Found ${numCrAuctions} auctions (${getProcessMemoryStats()})`)
        }

        const auctionCacheFile = path.resolve(this.auctionsDir, `auctions-${this.apiAccessor.regionConfig.slug}.json`)
        console.info(`Saving ${regionAuctions.auctions.length} auctions to ${auctionCacheFile}`)
        await this.saveDataToCache(auctionCacheFile, regionAuctions)
    }
}
