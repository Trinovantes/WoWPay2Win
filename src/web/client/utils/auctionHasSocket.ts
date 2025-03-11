import { ItemAuction } from '@/common/Cache'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const socketBonusIds = new Set(require(DEFINE.SOCKET_BONUS_ID_DATA_FILE) as Array<number>) // Webpack specific function

export function auctionHasSocket(auction: ItemAuction): boolean {
    for (const bonusId of auction.bonuses) {
        if (socketBonusIds.has(bonusId)) {
            return true
        }
    }

    return false
}
