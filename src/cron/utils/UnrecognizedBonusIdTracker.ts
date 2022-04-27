import type { ItemAuction } from '@/cron/models/ItemAuctions'

const MAX_UNRECOGNIZED_IDS = 10

class UnrecognizedBonusIdTracker {
    private readonly _unrecognizedIds = new Map<number, Array<ItemAuction>>()

    add(bonusId: number, auction: ItemAuction): void {
        if (!DEFINE.IS_DEV) {
            return
        }

        if (!this._unrecognizedIds.has(bonusId)) {
            this._unrecognizedIds.set(bonusId, [])
        }

        this._unrecognizedIds.get(bonusId)?.push(auction)
    }

    print(): void {
        if (!DEFINE.IS_DEV) {
            return
        }

        for (const [bonusId, auctions] of this._unrecognizedIds.entries()) {
            console.info(`Unrecognized Bonus Id:${bonusId} (${auctions.length})`)

            for (let i = 0; i < MAX_UNRECOGNIZED_IDS && i < auctions.length; i++) {
                const wowheadLink = `https://www.wowhead.com/item=${auctions[i].itemId}?bonus=${auctions[i].bonuses.join(':')}`
                console.info(wowheadLink)
            }
        }
    }
}

export const unrecognizedBonusIdTracker = new UnrecognizedBonusIdTracker()
