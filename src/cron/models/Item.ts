import { existsSync, createWriteStream } from 'fs'
import path from 'path'

import { Locale } from '@common/Constants'
import { ICache, IItemCache } from '@common/ICache'

import { IItemMediaResponse, IItemResponse } from '@cron/api/API'
import { APIAccessor } from '@cron/api/APIAccessor'

import { Region } from './Region'
import { Cacheable } from './Cacheable'

export class Item extends Cacheable {
    readonly iconFile: string
    readonly iconPath: string

    readonly itemAccessor: APIAccessor<IItemResponse>
    readonly itemMediaAccessor: APIAccessor<IItemMediaResponse>

    readonly region: Region
    readonly id: number
    localizedName: { [key in Locale]?: string }
    baseLevel: number
    iconUrl: string | null

    constructor(region: Region, id: number) {
        super(`item-${id}.json`)

        if (!DEFINE.IMAGE_DIR) {
            throw new Error('DEFINE.IMAGE_DIR is not set by the preprocessor')
        }

        this.iconFile = `${id}.jpg`
        this.iconPath = path.resolve(DEFINE.IMAGE_DIR, 'items', this.iconFile)

        const itemEndpoint = `${region.config.apiHost}/data/wow/item/${id}`
        this.itemAccessor = new APIAccessor(itemEndpoint, false, region)

        const itemMediaEndpoint = `${region.config.apiHost}/data/wow/media/item/${id}`
        this.itemMediaAccessor = new APIAccessor(itemMediaEndpoint, false, region)

        this.region = region
        this.id = id
        this.localizedName = {}
        this.baseLevel = NaN
        this.iconUrl = null
    }

    import(fileContents: string): boolean {
        const cachedItem = JSON.parse(fileContents) as IItemCache

        this.localizedName = cachedItem.localizedName
        this.baseLevel = cachedItem.baseLevel
        this.iconUrl = cachedItem.iconUrl

        if (!this.localizedName[this.region.config.locale]) {
            return false
        }

        if (!this.iconUrl || !existsSync(this.iconPath)) {
            return false
        }

        return true
    }

    export(): ICache {
        const cachedItem: IItemCache = {
            localizedName: this.localizedName,
            baseLevel: this.baseLevel,
            iconUrl: this.iconUrl,
        }

        return cachedItem
    }

    async fetch(): Promise<void> {
        console.info(`Item::fetch ${this.toString()}`)

        if (await this.loadFromCache()) {
            console.debug(`Loaded ${this.toString()} from ${this.cacheFile}`)
            return
        }

        const itemResponse = await this.itemAccessor.fetch()
        if (!itemResponse) {
            console.warn(`Failed to fetch ${this.toString()}`)
            return
        }

        this.baseLevel = itemResponse.level
        this.localizedName[this.region.config.locale] = itemResponse.name

        if (!this.iconUrl || !existsSync(this.iconPath)) {
            const itemMediaResponse = await this.itemMediaAccessor.fetch()
            const assets = itemMediaResponse?.assets || []
            for (const asset of assets) {
                if (asset.key === 'icon') {
                    this.iconUrl = asset.value
                    break
                }
            }

            await this.downloadMedia()
        }

        console.debug(`Saving ${this.toString()} to ${this.cacheFile}`)
        await this.saveToCache()
    }

    private async downloadMedia(): Promise<void> {
        const iconUrl = this.iconUrl
        if (!iconUrl) {
            console.warn('Cannot download media because iconUrl does not exist')
            return
        }

        const cmd = `${this.iconUrl} to ${this.iconPath}`
        const fileWriter = createWriteStream(this.iconPath)
        const stream = await APIAccessor.fetchFile(iconUrl)

        // Register listeners first
        const fileWriterResult = new Promise<void>((resolve, reject) => {
            fileWriter.on('finish', () => {
                console.debug(`File writer closed ${this.iconPath}`)
                resolve()
            })
            fileWriter.on('error', (error) => {
                console.warn(`File writer encountered an error ${this.iconPath}`)
                reject(error)
            })
        })

        // Then run the fileWriter
        if (stream) {
            console.debug(`Starting to download ${cmd}`)
            stream.pipe(fileWriter)
        } else {
            console.debug(`Failed to obtain stream for ${this.iconUrl}`)
            fileWriter.close()
        }

        return fileWriterResult
    }

    toString(): string {
        return `[Item:${this.id} ${this.region.config.locale}]`
    }
}
