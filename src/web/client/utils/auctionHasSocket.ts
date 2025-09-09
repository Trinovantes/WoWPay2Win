import type { ItemAuction } from '../../../common/Cache.ts'
import type { CachedSocketIdsFile } from '../../../scripts/fetchSocketIds.ts'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const socketBonusIds = new Set(require(__SOCKET_BONUS_ID_DATA_FILE__) as CachedSocketIdsFile) // Webpack specific function

export function auctionHasSocket(auction: ItemAuction): boolean {
    for (const bonusId of auction.bonusIds ?? []) {
        if (socketBonusIds.has(bonusId)) {
            return true
        }
    }

    return false
}
