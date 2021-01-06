import { ItemAuction } from '@cron/models/ItemAuctions'

class UnrecognizedBonusIdTracker {
    private readonly unrecognizedIds: { [bonusId: number]: Array<ItemAuction> } = {}

    add(bonusId: number, auction: ItemAuction): void {
        if (!(bonusId in this.unrecognizedIds)) {
            this.unrecognizedIds[bonusId] = []
        }

        this.unrecognizedIds[bonusId].push(auction)
    }

    print(): void {
        for (const [bonusId, auctions] of Object.entries(this.unrecognizedIds)) {
            console.info(`Unrecognized Bonus Id:${bonusId} (${auctions.length})`)

            for (const auction of auctions) {
                const wowheadLink = `https://www.wowhead.com/item=${auction.itemId}?bonus=${auction.bonuses.join(':')}`
                console.info(wowheadLink)
            }
        }
    }
}

const unrecognizedBonusIdTracker = new UnrecognizedBonusIdTracker()
export default unrecognizedBonusIdTracker
