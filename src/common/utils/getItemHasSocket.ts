import type { SocketBonusIdsCacheFile } from '../../scripts/fetchBonusIds.ts'

const socketBonusIds = await (async (): Promise<Set<number>> => {
    if (__IS_WEBPACK__) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return new Set(require(__SOCKET_BONUS_ID_DATA_FILE__) as SocketBonusIdsCacheFile) // Webpack specific function
    } else {
        const fs = await import('node:fs')
        const fileContents = fs.readFileSync(__SOCKET_BONUS_ID_DATA_FILE__).toString('utf8')
        const fileData = JSON.parse(fileContents) as SocketBonusIdsCacheFile
        return new Set(fileData)
    }
})()

export function getItemHasSocket(bonusIds = new Array<number>()): boolean {
    for (const bonusId of bonusIds) {
        if (socketBonusIds.has(bonusId)) {
            return true
        }
    }

    return false
}
