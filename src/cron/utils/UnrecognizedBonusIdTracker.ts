import { ItemAuction } from '@/cron/models/ItemAuctions'

const MAX_UNRECOGNIZED_IDS = 10

class UnrecognizedBonusIdTracker {
    private readonly _unrecognizedIds: { [bonusId: number]: Array<ItemAuction> } = {}

    add(bonusId: number, auction: ItemAuction): void {
        if (!DEFINE.IS_DEV) {
            return
        }

        if (!(bonusId in this._unrecognizedIds)) {
            this._unrecognizedIds[bonusId] = []
        }

        this._unrecognizedIds[bonusId].push(auction)
    }

    print(): void {
        if (!DEFINE.IS_DEV) {
            return
        }

        for (const [bonusId, auctions] of Object.entries(this._unrecognizedIds)) {
            console.info(`Unrecognized Bonus Id:${bonusId} (${auctions.length})`)

            for (let i = 0; i < MAX_UNRECOGNIZED_IDS && i < auctions.length; i++) {
                const wowheadLink = `https://www.wowhead.com/item=${auctions[i].itemId}?bonus=${auctions[i].bonuses.join(':')}`
                console.info(wowheadLink)
            }
        }
    }
}

export const unrecognizedBonusIdTracker = new UnrecognizedBonusIdTracker()
