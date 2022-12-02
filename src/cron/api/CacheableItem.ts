import { existsSync, createWriteStream } from 'fs'
import path from 'path'
import { fetchFile } from '../utils/fetchFile'
import type { Item } from '@/common/Cache'
import type { Locale } from '@/common/RegionConfig'
import { Cacheable } from './Cacheable'
import type { ApiAccessor } from '../api/ApiAccessor'
import type { BnetItemMediaResponse, BnetItemResponse } from '../api/BnetResponse'

/**
 * High level information about an Item for a specific region (specific to the ApiAccessor)
 * This has no relation to specific instances of items in game
 */
export class CacheableItem extends Cacheable<Item> {
    readonly id: number
    readonly iconPath: string
    #localizedName: Partial<Record<Locale, string>>
    #baseLevel: number

    constructor(apiAccessor: ApiAccessor, id: number, dataDir: string, imgDir: string) {
        super(apiAccessor, path.resolve(dataDir, `item-${id}.json`))

        this.id = id
        this.iconPath = path.resolve(imgDir, 'items', `${id}.jpg`)

        this.#localizedName = {}
        this.#baseLevel = NaN
    }

    override toString(): string {
        return `[CacheableItem:${this.id} ${this.apiAccessor.regionConfig.locale}]`
    }

    get itemEndpoint(): string {
        return `/data/wow/item/${this.id}`
    }

    get itemMediaEndpoint(): string {
        return `/data/wow/media/item/${this.id}`
    }

    import(fileContents: string): boolean {
        const cachedItem = JSON.parse(fileContents) as Item

        this.#localizedName = cachedItem.localizedName
        this.#baseLevel = cachedItem.baseLevel

        if (!this.#localizedName[this.apiAccessor.regionConfig.locale]) {
            console.info(`Cache file ${this.cacheFile} is missing this region's locale:${this.apiAccessor.regionConfig.locale}`)
            return false
        }

        if (!existsSync(this.iconPath)) {
            console.info(`Cache file ${this.cacheFile} is missing icon on disk`)
            return false
        }

        return true
    }

    export(): Item {
        const item: Item = {
            localizedName: this.#localizedName,
            baseLevel: this.#baseLevel,
        }

        return item
    }

    async fetch(): Promise<void> {
        console.info(`CacheableItem::fetch ${this.toString()}`)

        if (await this.loadDataFromCache()) {
            console.info(`Loaded ${this.toString()} from ${this.cacheFile}`)
            return
        }

        const itemResponse = await this.apiAccessor.fetch<BnetItemResponse>(this.itemEndpoint, false, (res) => {
            if (!res?.name) {
                return 'Missing name in response'
            }

            return null
        })

        if (!itemResponse) {
            console.warn(`Failed to fetch ${this.toString()}`)
            return
        }

        this.#baseLevel = itemResponse.level
        this.#localizedName[this.apiAccessor.regionConfig.locale] = itemResponse.name

        console.info(`Saving ${this.toString()} to ${this.cacheFile}`)
        await this.saveDataToCache()
        await this.#downloadMedia()
    }

    async #downloadMedia(): Promise<void> {
        if (existsSync(this.iconPath)) {
            return
        }

        const itemMediaResponse = await this.apiAccessor.fetch<BnetItemMediaResponse>(this.itemMediaEndpoint, false, (res) => {
            if (!res?.assets) {
                return 'Missing iconUrl in response'
            }

            return null
        })

        const assets = itemMediaResponse?.assets || []
        const iconUrl = assets.find((asset) => asset.key === 'icon')?.value
        if (!iconUrl) {
            console.warn(`Cannot download media due to missing iconUrl ${this.toString()}`, itemMediaResponse)
            return
        }

        const stream = await fetchFile(iconUrl)
        if (!stream) {
            console.info(`Failed to obtain stream for ${iconUrl}`)
            return
        }

        const fileWriter = createWriteStream(this.iconPath)
        const fileWriterResult = new Promise<void>((resolve, reject) => {
            fileWriter.on('finish', () => {
                console.info(`File writer finished ${this.iconPath}`)
                resolve()
            })
            fileWriter.on('error', (error) => {
                console.warn(`File writer encountered an error ${this.iconPath}`)
                reject(error)
            })
        })

        try {
            console.info(`Starting to download ${iconUrl} to ${this.iconPath}`)
            stream.pipe(fileWriter)
            await fileWriterResult
        } catch (err) {
            console.warn(`Failed to download ${iconUrl} to ${this.iconPath}`, err)
        } finally {
            fileWriter.close()
        }
    }
}
