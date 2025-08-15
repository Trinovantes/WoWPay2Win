import { SOCKET_BONUS_ID_DATA_FILE } from '@/common/Constants'
import fs from 'node:fs/promises'
import path from 'node:path'

export type CachedSocketIdsFile = Array<number>

async function main() {
    const bonusJson = await (await fetch('https://www.raidbots.com/static/data/live/bonus-sockets.json')).json() as Record<string, number>
    const cache: CachedSocketIdsFile = []

    for (const id of Object.keys(bonusJson)) {
        const bonusId = parseInt(id)
        cache.push(bonusId)
    }

    const filePath = path.resolve(SOCKET_BONUS_ID_DATA_FILE)
    const fileContents = DEFINE.IS_DEV
        ? JSON.stringify(cache, null, 4)
        : JSON.stringify(cache)

    console.info(`Saving ${cache.length} socket bonusIds to ${filePath}`)
    await fs.writeFile(filePath, fileContents, 'utf-8')
}

main().catch((err) => {
    console.warn(err)
    process.exit(1)
})
