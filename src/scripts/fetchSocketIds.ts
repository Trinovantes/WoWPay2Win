import { SOCKET_BONUS_ID_DATA_FILE } from '@/common/Constants'
import fs from 'node:fs/promises'
import path from 'node:path'

type RaidbotsBonusIdResponse = Record<string, {
    id: number
    socket?: number
}>

async function main() {
    const socketIds = new Set<number>()
    const bonusJson = await (await fetch('https://www.raidbots.com/static/data/live/bonuses.json')).json() as RaidbotsBonusIdResponse

    for (const [, data] of Object.entries(bonusJson)) {
        if (data.socket !== 1) {
            continue
        }

        socketIds.add(data.id)
    }

    const filePath = path.resolve(SOCKET_BONUS_ID_DATA_FILE)
    const fileContents = DEFINE.IS_DEV
        ? JSON.stringify([...socketIds], null, 4)
        : JSON.stringify([...socketIds])

    console.info(`Saving ${socketIds.size} socketIds to ${filePath}`)
    await fs.writeFile(filePath, fileContents, 'utf-8')
}

main().catch((err) => {
    console.warn(err)
    process.exit(1)
})
