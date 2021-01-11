import { checkIsBonusIlvl, checkIsSocket, checkIsTertiary, isCorruptionBonusId, Tertiary } from '@common/Bonuses'
import { IItemAuctionCache } from '@common/ICache'
import unrecognizedBonusIdTracker from '@cron/utils/UnrecognizedBonusIdTracker'

// ----------------------------------------------------------------------------
// ItemAuction
// ----------------------------------------------------------------------------

export class ItemAuction {
    readonly id: number
    readonly crId: number
    readonly itemId: number
    readonly buyout: number
    readonly bonuses: Array<number>

    // Technically these can be computed on the frontend but it's simplier to compute these on the backend
    readonly bonusIlvl: number
    readonly hasSocket: boolean
    readonly tertiary: Tertiary | null

    constructor(id: number, connectedRealmId: number, itemId: number, buyout: number, bonuses: Array<number>) {
        this.id = id
        this.crId = connectedRealmId
        this.itemId = itemId
        this.buyout = buyout
        this.bonuses = bonuses

        this.bonusIlvl = 0
        this.hasSocket = false
        this.tertiary = null

        for (const bonusId of bonuses) {
            if (isCorruptionBonusId(bonusId)) {
                continue
            }

            const bonusIlvl = checkIsBonusIlvl(bonusId)
            if (bonusIlvl) {
                this.bonusIlvl = bonusIlvl
                continue
            }

            const isSocket = checkIsSocket(bonusId)
            if (isSocket) {
                this.hasSocket = true
                continue
            }

            const tertiary = checkIsTertiary(bonusId)
            if (tertiary) {
                this.tertiary = tertiary
                continue
            }

            unrecognizedBonusIdTracker.add(bonusId, this)
        }
    }

    export(): IItemAuctionCache {
        return {
            id: this.id,
            crId: this.crId,
            itemId: this.itemId,
            buyout: this.buyout,
            bonuses: this.bonuses,

            bonusIlvl: this.bonusIlvl,
            hasSocket: this.hasSocket,
            tertiary: this.tertiary,
        }
    }
}
