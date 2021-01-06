import { Tertiary } from '@common/Constants'
import { IItemAuctionCache } from '@common/ICache'
import unrecognizedBonusIdTracker from '@cron/utils/UnrecognizedBonusIdTracker'

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

            if (isCorruptionBonusId(bonusId)) {
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
                case 6514: // Nyalotha
                case 6935: // Castle Nathria
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

                default:
                    unrecognizedBonusIdTracker.add(bonusId, this)
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

// ----------------------------------------------------------------------------
// Corruptions
// ----------------------------------------------------------------------------

// Some of these bundle into same id
// 1st id : corruption amount
// 2nd id : corruption effect on item (sometimes same id as corruption effect id)
// 3th id : spell effect id
const Corruptions: Array<[number, number | null, number, string]> = [
    [6455, 6483, 315607, 'Avoidant I'],
    [6460, 6484, 315608, 'Avoidant II'],
    [6465, 6485, 315609, 'Avoidant III'],
    [6455, 6474, 315544, 'Expedient I'],
    [6460, 6475, 315545, 'Expedient II'],
    [6465, 6476, 315546, 'Expedient III'],
    [6455, 6471, 315529, 'Masterful I'],
    [6460, 6472, 315530, 'Masterful II'],
    [6465, 6473, 315531, 'Masterful III'],
    [6455, 6480, 315554, 'Severe I'],
    [6460, 6481, 315557, 'Severe II'],
    [6465, 6482, 315558, 'Severe III'],
    [6455, 6477, 315549, 'Versatile I'],
    [6460, 6478, 315552, 'Versatile II'],
    [6465, 6479, 315553, 'Versatile III'],
    [6455, 6493, 315590, 'Siphoner I'],
    [6460, 6494, 315591, 'Siphoner II'],
    [6465, 6495, 315592, 'Siphoner III'],
    [6455, 6437, 315277, 'Strikethrough I'],
    [6460, 6438, 315281, 'Strikethrough II'],
    [6465, 6439, 315282, 'Strikethrough III'],
    [6555, null, 318266, 'Racing Pulse I'],
    [6559, null, 318492, 'Racing Pulse II'],
    [6560, null, 318496, 'Racing Pulse III'],
    [6556, null, 318268, 'Deadly Momentum I'],
    [6561, null, 318493, 'Deadly Momentum II'],
    [6562, null, 318497, 'Deadly Momentum III'],
    [6558, null, 318270, 'Surging Vitality I'],
    [6565, null, 318495, 'Surging Vitality II'],
    [6566, null, 318499, 'Surging Vitality III'],
    [6557, null, 318269, 'Honed Mind I'],
    [6563, null, 318494, 'Honed Mind II'],
    [6564, null, 318498, 'Honed Mind III'],
    [6549, null, 318280, 'Echoing Void I'],
    [6550, null, 318485, 'Echoing Void II'],
    [6551, null, 318486, 'Echoing Void III'],
    [6552, null, 318274, 'Infinite Stars I'],
    [6553, null, 318487, 'Infinite Stars II'],
    [6554, null, 318488, 'Infinite Stars III'],
    [6547, null, 318303, 'Ineffable Truth I'],
    [6548, null, 318484, 'Ineffable Truth II'],
    [6537, null, 318276, 'Twilight Devastation I'],
    [6538, null, 318477, 'Twilight Devastation II'],
    [6539, null, 318478, 'Twilight Devastation III'],
    [6543, null, 318481, 'Twisted Appendage I'],
    [6544, null, 318482, 'Twisted Appendage II'],
    [6545, null, 318483, 'Twisted Appendage III'],
    [6540, null, 318286, 'Void Ritual I'],
    [6541, null, 318479, 'Void Ritual II'],
    [6542, null, 318480, 'Void Ritual III'],
    [6573, null, 318272, 'Gushing Wound'],
    [6546, null, 318239, 'Glimpse of Clarity'],
]

// Corruption Amounts
// New from hotfixes: old items still have old corruption amounts, only new items will have new amounts
const HotfixCorruptionIds = [
    6613,
    6614,
    6462,
    6470,
    6461,
    6612,
    6453,
    6457,
]

function isCorruptionBonusId(bonusId: number): boolean {
    for (const corruption of Corruptions) {
        const corruptionAmountId = corruption[0]
        const corruptionEffectId = corruption[1]

        if (bonusId === corruptionAmountId || bonusId === corruptionEffectId) {
            return true
        }

        if (HotfixCorruptionIds.includes(bonusId)) {
            return true
        }
    }

    return false
}
