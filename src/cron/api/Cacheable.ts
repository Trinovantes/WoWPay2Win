import { existsSync } from 'fs'
import fs from 'fs/promises'
import dayjs from 'dayjs'
import type { ApiAccessor } from './ApiAccessor'

// ----------------------------------------------------------------------------
// Cacheable
//
// Abstract class that abstracts an entity with info that should be saved to file
// i.e. to save network calls later (Item and Region data don't change often and should be cached)
// ----------------------------------------------------------------------------

export abstract class Cacheable<T> {
    protected apiAccessor: ApiAccessor
    readonly cacheFile: string

    constructor(apiAccessor: ApiAccessor, cacheFile: string) {
        this.apiAccessor = apiAccessor
        this.cacheFile = cacheFile
    }

    abstract fetch(): Promise<void>
    protected abstract import(fileContents: string): boolean
    protected abstract export(): T

    protected async loadDataFromCache(): Promise<boolean> {
        if (!existsSync(this.cacheFile)) {
            console.info(`Cache file ${this.cacheFile} not found`)
            return false
        }

        const stat = await fs.stat(this.cacheFile)
        const now = dayjs()
        const modDate = dayjs(stat.mtime)
        if (modDate.isBefore(now.subtract(1, 'week'))) {
            console.info(`Cache file ${this.cacheFile} is too old: ${modDate.fromNow()}`)
            return false
        }

        const fileContents = await fs.readFile(this.cacheFile, 'utf-8')
        return this.import(fileContents)
    }

    protected async saveDataToCache<D>(cacheFileOverwrite?: string, contentOverride?: D): Promise<boolean> {
        const cacheFile = cacheFileOverwrite ?? this.cacheFile
        const cachedContents = contentOverride ?? this.export()
        const fileContents = DEFINE.IS_DEV
            ? JSON.stringify(cachedContents, null, 4)
            : JSON.stringify(cachedContents)

        await fs.writeFile(cacheFile, fileContents, 'utf-8')
        return true
    }
}
