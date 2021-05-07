import { Data } from '@/common/Data'
import { existsSync } from 'fs'
import fs from 'fs/promises'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

// ----------------------------------------------------------------------------
// Cacheable
//
// Abstract class that abstracts an entity with info that should be saved to file
// i.e. to save network calls later (Item and Region data don't change often and should be cached)
// ----------------------------------------------------------------------------

export abstract class Cacheable {
    readonly cacheFile: string

    constructor(cacheFile: string) {
        this.cacheFile = cacheFile
    }

    abstract fetch(): Promise<void>

    protected abstract import(fileContents: string): boolean

    protected abstract export(): Data

    protected async loadDataFromCache(): Promise<boolean> {
        return loadDataFromCache(this.cacheFile, (fileContents) => {
            return this.import(fileContents)
        })
    }

    protected async saveDataToCache(): Promise<boolean> {
        const cachedContents = this.export()
        return saveDataToCache(this.cacheFile, cachedContents)
    }
}

export async function loadDataFromCache(cacheFile: string, onLoad: (fileContents: string) => boolean): Promise<boolean> {
    if (!cacheFile || !existsSync(cacheFile)) {
        console.info(`Cache file ${cacheFile} not found`)
        return false
    }

    const stat = await fs.stat(cacheFile)
    const now = dayjs()
    const modDate = dayjs(stat.mtime)
    if (modDate.isBefore(now.subtract(1, 'week'))) {
        console.info(`Cache file ${cacheFile} is too old: ${modDate.fromNow()}`)
        return false
    }

    const fileContents = await fs.readFile(cacheFile, 'utf-8')
    return onLoad(fileContents)
}

export async function saveDataToCache(cacheFile: string, data: Data): Promise<boolean> {
    if (!cacheFile) {
        console.warn(`No cache file provided ${cacheFile}`)
        return false
    }

    let fileContents: string
    if (DEFINE.IS_DEV) {
        fileContents = JSON.stringify(data, null, 4)
    } else {
        fileContents = JSON.stringify(data)
    }

    await fs.writeFile(cacheFile, fileContents, 'utf-8')
    return true
}
