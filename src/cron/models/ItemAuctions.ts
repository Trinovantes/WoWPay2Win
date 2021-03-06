import { checkIsBonusIlvl, checkIsDifficultyId, checkIsSocket, checkIsTertiary, isCorruptionBonusId, Tertiary } from '@/common/BonusId'
import { ItemAuctionData } from '@/common/Data'
import { unrecognizedBonusIdTracker } from '@/cron/utils/UnrecognizedBonusIdTracker'

// ----------------------------------------------------------------------------
// ItemAuction
//
// A specific instance of an auction
// ----------------------------------------------------------------------------

export class ItemAuction {
    readonly id: number
    readonly crId: number
    readonly itemId: number
    readonly buyout: number
    readonly bonuses: Array<number>

    // Technically these can be computed on the frontend but it's simpler to compute these on the backend
    readonly bonusIlvl?: number
    readonly hasSocket?: boolean
    readonly tertiary?: Tertiary

    constructor(id: number, connectedRealmId: number, itemId: number, buyout: number, bonuses: Array<number>) {
        this.id = id
        this.crId = connectedRealmId
        this.itemId = itemId
        this.buyout = buyout
        this.bonuses = bonuses

        for (const bonusId of bonuses) {
            if (isCorruptionBonusId(bonusId)) {
                continue
            }

            if (checkIsDifficultyId(bonusId)) {
                continue
            }

            const bonusIlvl = checkIsBonusIlvl(bonusId)
            if (bonusIlvl !== undefined) {
                if (bonusIlvl !== 0) {
                    this.bonusIlvl = bonusIlvl
                }
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

    export(): ItemAuctionData {
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
