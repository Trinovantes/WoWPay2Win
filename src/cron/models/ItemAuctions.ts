import { Tertiary } from '@common/Constants'
import { IItemAuctionCache } from '@common/ICache'

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
            if (bonusId >= 1372 && bonusId <= 1672) {
                const ZERO_ILVL = 1472
                this.bonusIlvl = bonusId - ZERO_ILVL
                continue
            }

            switch (bonusId) {
                case 4825: // LFR
                    this.bonusIlvl = 0
                    break

                case 4822: // Normal
                    this.bonusIlvl = 15
                    break

                case 4823: // Heroic
                    this.bonusIlvl = 30
                    break

                case 4824: // Mythic
                    this.bonusIlvl = 45
                    break

                case 1808:
                case 6514:
                    this.hasSocket = true
                    break

                case 40:
                    this.tertiary = Tertiary.Avoidance
                    break
                case 41:
                    this.tertiary = Tertiary.Leech
                    break
                case 42:
                    this.tertiary = Tertiary.Speed
                    break
                case 43:
                    this.tertiary = Tertiary.Indestructible
                    break
            }
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
