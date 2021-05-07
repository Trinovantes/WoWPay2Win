import { existsSync, createWriteStream } from 'fs'
import path from 'path'
import { Locale } from '@/common/Constants'
import { Data, ItemData } from '@/common/Data'
import { BnetItemMediaResponse, BnetItemResponse } from '@/cron/api/Responses'
import { ApiAccessor } from '@/cron/api/ApiAccessor'
import { Region } from '@/cron/models/Region'
import { Cacheable } from '@/cron/models/Cacheable'

// ----------------------------------------------------------------------------
// Item
//
// High level information about an Item
// This has no relation to specific instances of items in game
// ----------------------------------------------------------------------------

export class Item extends Cacheable {
    readonly iconPath: string
    readonly itemAccessor: ApiAccessor<BnetItemResponse>
    readonly itemMediaAccessor: ApiAccessor<BnetItemMediaResponse>

    readonly region: Region
    readonly id: number
    localizedName: Partial<Record<Locale, string>>
    baseLevel: number
    iconUrl: string | null

    constructor(region: Region, id: number, dataDir: string, imgDir: string) {
        super(path.resolve(dataDir, `item-${id}.json`))

        const itemEndpoint = `${region.config.apiHost}/data/wow/item/${id}`
        const itemMediaEndpoint = `${region.config.apiHost}/data/wow/media/item/${id}`

        this.iconPath = path.resolve(imgDir, 'items', `${id}.jpg`)
        this.itemAccessor = new ApiAccessor(itemEndpoint, false, region)
        this.itemMediaAccessor = new ApiAccessor(itemMediaEndpoint, false, region)

        this.region = region
        this.id = id
        this.localizedName = {}
        this.baseLevel = NaN
        this.iconUrl = null
    }

    import(fileContents: string): boolean {
        const cachedItem = JSON.parse(fileContents) as ItemData

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

    export(): Data {
        const cachedItem: ItemData = {
            localizedName: this.localizedName,
            baseLevel: this.baseLevel,
            iconUrl: this.iconUrl,
        }

        return cachedItem
    }

    async fetch(): Promise<void> {
        console.info(`Item::fetch ${this.toString()}`)

        if (await this.loadDataFromCache()) {
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
        await this.saveDataToCache()
    }

    private async downloadMedia(): Promise<void> {
        const iconUrl = this.iconUrl
        if (!iconUrl) {
            console.warn('Cannot download media because iconUrl does not exist')
            return
        }

        const cmd = `${this.iconUrl} to ${this.iconPath}`
        const fileWriter = createWriteStream(this.iconPath)
        const stream = await ApiAccessor.fetchFile(iconUrl)

        // Register listeners first
        const fileWriterResult = new Promise<void>((resolve, reject) => {
            fileWriter.on('finish', () => {
                console.debug(`File writer finished ${this.iconPath}`)
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
