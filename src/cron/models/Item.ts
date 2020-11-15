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

export class Item extends Cacheable {
    readonly iconFile: string
    readonly iconPath: string

    readonly itemAccessor: APIAccessor
    readonly itemMediaAccessor: APIAccessor

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
        this.baseLevel = -1
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

        await this.itemAccessor.fetch(this.onReceiveData)

        if (!this.iconUrl || !existsSync(this.iconPath)) {
            await this.itemMediaAccessor.fetch(this.onReceiveMediaData)
            await this.downloadMedia()
        }

        console.debug(`Saving item ${this.region.config.locale} ${this.id} to ${this.cacheFile}`)
        await this.saveToCache()
    }

    private async downloadMedia(): Promise<void> {
        if (!this.iconUrl) {
            console.warn('Cannot download media because iconUrl does not exist')
            return
        }

        const fileWriter = createWriteStream(this.iconPath)
        const response = await Axios.get(this.iconUrl, {
            responseType: 'stream',
        })

        const stream = response.data as IncomingMessage
        stream.pipe(fileWriter)

        return new Promise((resolve, reject) => {
            fileWriter.on('finish', () => {
                console.debug(`Downloaded ${this.iconUrl} to ${this.iconPath}`)
                resolve()
            })
            fileWriter.on('error', (error) => {
                console.error(`Failed to download ${this.iconUrl} to ${this.iconPath}`)
                reject(error)
            })
        })
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    private onReceiveData = async(response: unknown): Promise<void> => {
        const data = response as IItemResponse

        this.baseLevel = data.level
        this.localizedName[this.region.config.locale] = data.name
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    private onReceiveMediaData = async(response: unknown): Promise<void> => {
        const data = response as IItemMediaResponse

        for (const asset of data.assets) {
            if (asset.key === 'icon') {
                this.iconUrl = asset.value
                break
            }
        }
    }

    toString(): string {
        return `[Item:${this.id}]`
    }
}
