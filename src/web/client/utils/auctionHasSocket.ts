import { ItemAuction } from '@/common/Cache'
import { CachedSocketIdsFile } from '@/scripts/fetchSocketIds'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const socketBonusIds = new Set(require(DEFINE.SOCKET_BONUS_ID_DATA_FILE) as CachedSocketIdsFile) // Webpack specific function

export function auctionHasSocket(auction: ItemAuction): boolean {
    for (const bonusId of auction.bonusIds ?? []) {
        if (socketBonusIds.has(bonusId)) {
            return true
        }
    }

    return false
}
