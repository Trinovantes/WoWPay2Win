import { existsSync, createWriteStream } from 'fs'
import Axios from 'axios'
import path from 'path'

import { Locale } from '@common/Constants'
import { IItemMediaResponse, IItemResponse } from './API'
import { APIAccessor } from './APIAccessor'
import { Region } from './Region'
import { ICache, IItemCache } from '@common/ICache'
import { IncomingMessage } from 'http'
import { Cacheable } from './Cacheable'
import { tryExponentialBackoff } from '@common/utils'

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

        if (!process.env.IMAGE_DIR) {
            throw new Error('Cannot find IMAGE_DIR in env')
        }

        this.iconFile = `${id}.jpg`
        this.iconPath = path.resolve(process.env.IMAGE_DIR, 'items', this.iconFile)

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
            console.debug(`Loaded item ${this.region.config.locale} ${this.id} from ${this.cacheFile}`)
            return
        }

        await tryExponentialBackoff(async() => {
            const itemResponse = await this.itemAccessor.fetch()
            this.baseLevel = itemResponse.level
            this.localizedName[this.region.config.locale] = itemResponse.name

            if (!this.iconUrl || !existsSync(this.iconPath)) {
                const itemMediaResponse = await this.itemMediaAccessor.fetch()
                for (const asset of itemMediaResponse.assets) {
                    if (asset.key === 'icon') {
                        this.iconUrl = asset.value
                        break
                    }
                }

                await this.downloadMedia()
            }

            console.debug(`Saving item ${this.region.config.locale} ${this.id} to ${this.cacheFile}`)
            await this.saveToCache()
        })
    }

    private async downloadMedia(): Promise<void> {
        const iconUrl = this.iconUrl
        if (!iconUrl) {
            console.warn('Cannot download media because iconUrl does not exist')
            return
        }

        const fileWriter = createWriteStream(this.iconPath)
        const response = await tryExponentialBackoff(async() => {
            return await Axios.get(iconUrl, {
                responseType: 'stream',
            })
        })

        // Register listeners first
        const fileWriterResult = new Promise<void>((resolve, reject) => {
            fileWriter.on('finish', () => {
                console.debug(`Downloaded ${this.iconUrl} to ${this.iconPath}`)
                resolve()
            })
            fileWriter.on('error', (error) => {
                console.warn(`Failed to download ${this.iconUrl} to ${this.iconPath}`)
                reject(error)
            })
        })

        // Then run the fileWriter
        if (response) {
            const stream = response.data as IncomingMessage
            stream.pipe(fileWriter)
        } else {
            fileWriter.close()
        }

        return fileWriterResult
    }

    toString(): string {
        return `[Item:${this.id}]`
    }
}
