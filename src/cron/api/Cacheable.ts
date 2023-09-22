import { existsSync } from 'fs'
import fs from 'fs/promises'
import { CACHE_DURATION } from '@/common/Constants'
import type { ApiAccessor } from './ApiAccessor'
import { isBefore, add } from 'date-fns'

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
        const lastWeek = add(new Date(), { weeks: -CACHE_DURATION })
        const lastModified = new Date(stat.mtime)
        if (isBefore(lastModified, lastWeek)) {
            console.info(`Cache file ${this.cacheFile} is too old: ${lastModified.toISOString()}`)
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
