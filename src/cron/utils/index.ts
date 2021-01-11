import { existsSync, promises as fs } from 'fs'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import { ICache } from '@common/ICache'

export async function loadCacheFromFile(cacheFile: string, onLoad: (fileContents: string) => boolean): Promise<boolean> {
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

export async function saveCacheToFile(cacheFile: string, cachedContents: ICache): Promise<boolean> {
    if (!cacheFile) {
        console.warn(`No cache file provided ${cacheFile}`)
        return false
    }

    let fileContents: string
    if (DEFINE.IS_DEV) {
        fileContents = JSON.stringify(cachedContents, null, 4)
    } else {
        fileContents = JSON.stringify(cachedContents)
    }

    await fs.writeFile(cacheFile, fileContents, 'utf-8')
    return true
}
