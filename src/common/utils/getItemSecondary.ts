import type { ItemAuction } from '../Cache.ts'
import type { Secondary } from '../ItemBonusId.ts'
import { getSecondaryFromModifiers } from '../ItemModifier.ts'
import type { SecondaryBonusIdsCacheFile } from '../../scripts/fetchBonusIds.ts'
import type { BonusId } from '../api/BnetResponse.ts'

const secondaryBonusIds = await (async (): Promise<Map<BonusId, Array<Secondary>>> => {
    if (__IS_WEBPACK__) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        return new Map(require(__SECONDARY_BONUS_ID_DATA_FILE__) as SecondaryBonusIdsCacheFile) // Webpack specific function
    } else {
        const fs = await import('node:fs')
        const fileContents = fs.readFileSync(__SECONDARY_BONUS_ID_DATA_FILE__).toString('utf8')
        const fileData = JSON.parse(fileContents) as SecondaryBonusIdsCacheFile
        return new Map(fileData)
    }
})()

export function getItemSecondary(bonusIds = new Array<BonusId>()): Array<Secondary> {
    for (const bonusId of bonusIds) {
        const secondaries = secondaryBonusIds.get(bonusId)
        if (!secondaries) {
            continue
        }

        return secondaries
    }

    return []
}

export function getAuctionSecondary(auction: ItemAuction): Array<Secondary> {
    return [
        ...(getItemSecondary(auction.bonusIds)),
        ...(getSecondaryFromModifiers(auction.modifiers)),
    ]
}
