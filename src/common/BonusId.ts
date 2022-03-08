// ----------------------------------------------------------------------------
// Bonus ilvl
// ----------------------------------------------------------------------------

export function checkIsBonusIlvl(bonusId: number): number | undefined {
    if (bonusId >= 1372 && bonusId <= 1672) {
        const ZERO_ILVL = 1472
        return bonusId - ZERO_ILVL
    }

    return undefined
}

// ----------------------------------------------------------------------------
// Socket
// ----------------------------------------------------------------------------

export function checkIsSocket(bonusId: number): true | undefined {
    switch (bonusId) {
        case 1808:
        case 6514: // Nyalotha
        case 6935: // Castle Nathria
        case 7576: // Sanctum of Domination
        case 7580: // Sepulcher of the First Ones
            return true
    }

    return undefined
}

// ----------------------------------------------------------------------------
// Tertiary
// ----------------------------------------------------------------------------

// These values don't need to match the actual bonuses since it's checked by calling checkIsTertiary()
// We store enums with their actual bonus ids instead of starting from 0 for simplicity and to avoid confusion (since the enum values are used in url params too)
export enum Tertiary {
    Avoidance = 40,
    Leech = 41,
    Speed = 42,
    Indestructible = 43,
}

export function checkIsTertiary(bonusId: number): Tertiary | undefined {
    switch (bonusId) {
        case 40:
            return Tertiary.Avoidance

        case 41:
            return Tertiary.Leech

        case 42:
            return Tertiary.Speed

        case 43:
            return Tertiary.Indestructible
    }

    return undefined
}

// ----------------------------------------------------------------------------
// Secondary
// ----------------------------------------------------------------------------

export enum Secondary {
    Crit = 'Crit',
    Haste = 'Haste',
    Mastery = 'Mastery',
    Versatility = 'Versatility',
    CritHaste = 'Crit/Haste',
    CritMastery = 'Crit/Mastery',
    CritVersatility = 'Crit/Versatility',
    HasteMastery = 'Haste/Mastery',
    HasteVersatility = 'Haste/Versatility',
    MasteryVersatility = 'Mastery/Versatility',
}

export function checkIsSecondary(bonusId: number): Secondary | undefined {
    if ((bonusId >= 1676 && bonusId <= 1682) || (bonusId >= 7985 && bonusId <= 8002)) {
        return Secondary.CritVersatility
    }

    if ((bonusId >= 1683 && bonusId <= 1689) || (bonusId >= 8003 && bonusId <= 8020)) {
        return Secondary.CritMastery
    }

    if ((bonusId >= 1690 && bonusId <= 1696) || (bonusId >= 8021 && bonusId <= 8038)) {
        return Secondary.CritHaste
    }

    if ((bonusId >= 1697 && bonusId <= 1703) || (bonusId >= 8039 && bonusId <= 8056)) {
        return Secondary.HasteMastery
    }

    if ((bonusId >= 1704 && bonusId <= 1710) || (bonusId >= 8057 && bonusId <= 8074)) {
        return Secondary.HasteVersatility
    }

    if ((bonusId >= 1711 && bonusId <= 1717) || (bonusId >= 8075 && bonusId <= 8092)) {
        return Secondary.MasteryVersatility
    }

    if (bonusId === 1718) {
        return Secondary.Crit
    }

    if (bonusId === 1719) {
        return Secondary.Versatility
    }

    if (bonusId === 1720) {
        return Secondary.Haste
    }

    if (bonusId === 1721) {
        return Secondary.Mastery
    }

    return undefined
}

// ----------------------------------------------------------------------------
// BfA Corruptions
// ----------------------------------------------------------------------------

// Some of these bundle into same id
// 1st id : corruption amount
// 2nd id : corruption effect on item (sometimes same id as corruption amount id)
// 3th id : spell effect id
const corruptions: Array<[number, number | null, number, string]> = [
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

// New ids introduced from hotfixes: these ids change corruption amount on gear
// Old items still have old corruption amounts, only new items will have new ids
const hotfixCorruptionIds = [
    6613,
    6614,
    6462,
    6470,
    6461,
    6612,
    6453,
    6457,
]

export function isCorruptionBonusId(bonusId: number): boolean {
    for (const corruption of corruptions) {
        const corruptionAmountId = corruption[0]
        const corruptionEffectId = corruption[1]

        if (bonusId === corruptionAmountId || bonusId === corruptionEffectId) {
            return true
        }

        if (hotfixCorruptionIds.includes(bonusId)) {
            return true
        }
    }

    return false
}
