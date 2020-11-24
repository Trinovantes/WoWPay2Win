import { existsSync, promises as fs } from 'fs'
import dayjs from 'dayjs'
import path from 'path'
import relativeTime from 'dayjs/plugin/relativeTime'

import { ICache } from '@common/ICache'
import Constants from '@common/Constants'

dayjs.extend(relativeTime)

export abstract class Cacheable {
    readonly cacheFile: string

    constructor(cacheFile: string) {
        if (!process.env.CACHE_DIR) {
            throw new Error('Cannot find CACHE_DIR in env')
        }

        this.cacheFile = path.resolve(process.env.CACHE_DIR, cacheFile)
    }

    abstract fetch(): Promise<void>

    protected abstract import(fileContents: string): boolean

    protected abstract export(): ICache

    protected async loadFromCache(): Promise<boolean> {
        if (!this.cacheFile || !existsSync(this.cacheFile)) {
            console.warn(`Cache file ${this.cacheFile} not found`)
            return false
        }

        const stat = await fs.stat(this.cacheFile)
        const now = dayjs()
        const modDate = dayjs(stat.mtime)
        if (modDate.isBefore(now.subtract(1, 'week'))) {
            console.warn(`Cache file ${this.cacheFile} is too old: ${modDate.fromNow()}`)
            return false
        }

        const fileContents = await fs.readFile(this.cacheFile, 'utf-8')
        return this.import(fileContents)
    }

    protected async saveToCache(): Promise<boolean> {
        const cachedContents = this.export()
        return Cacheable.saveToCache(this.cacheFile, cachedContents)
    }

    protected static async saveToCache(cacheFile: string, cachedContents: ICache): Promise<boolean> {
        if (!cacheFile) {
            console.warn(`Failed to save cache file ${cacheFile}`)
            return false
        }

        let fileContents: string
        if (Constants.IS_DEV) {
            fileContents = JSON.stringify(cachedContents, null, 4)
        } else {
            fileContents = JSON.stringify(cachedContents)
        }

        await fs.writeFile(cacheFile, fileContents, 'utf-8')
        return true
    }
}
