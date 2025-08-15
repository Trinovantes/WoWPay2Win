// ----------------------------------------------------------------------------
// Banned
// ----------------------------------------------------------------------------

export function isBannedId(bonusId: number): boolean {
    switch (bonusId) {
        // In Dragonflight, "Razorwind Talisman" has base ilvl of 398 but drops with these ids that override the ilvl instead of using the 1372-1672 ids
        // Thus we need to ignore items with these ids
        case 9233: // 236 ilvl
        case 9156: // 327 ilvl
        case 9232: // 340 ilvl
            return true
    }

    return false
}

export function hasBannedId(bonusIds?: Array<number>): boolean {
    for (const id of bonusIds ?? []) {
        if (isBannedId(id)) {
            return true
        }
    }

    return false
}

// ----------------------------------------------------------------------------
// Bonus ilvl
// ----------------------------------------------------------------------------

export function isIlvlBonusId(bonusId: number): number | undefined {
    // Modifies -100 to +100 ilvls
    if (bonusId >= 1372 && bonusId <= 1672) {
        const ZERO_ILVL = 1472
        return bonusId - ZERO_ILVL
    }

    // Subtracts 101-400 ilvls
    if (bonusId >= 2829 && bonusId <= 3129) {
        const BASE_ILVL = 2829
        return -400 + (bonusId - BASE_ILVL)
    }

    // Adds 201-400 ilvls
    if (bonusId >= 3130 && bonusId <= 3329) {
        const BASE_ILVL = 3130
        return 201 + (bonusId - BASE_ILVL)
    }

    return undefined
}

// ----------------------------------------------------------------------------
// Tertiary
// ----------------------------------------------------------------------------

export const ALL_TERTIARIES = [
    {
        label: 'Avoidance',
        bonusId: 40,
    },
    {
        label: 'Leech',
        bonusId: 41,
    },
    {
        label: 'Speed',
        bonusId: 42,
    },
    {
        label: 'Indestructible',
        bonusId: 43,
    },
] as const

// These values don't actually need to match the bonusIds since they're checked by calling isTertiaryBonusId()
// However we still use their actual bonusIds instead of starting from 0 for simplicity and to avoid confusion (since the enum values are used in url params too)
export type Tertiary = typeof ALL_TERTIARIES[number]['bonusId']

export function isTertiaryBonusId(bonusId: number): bonusId is Tertiary {
    switch (bonusId) {
        case 40:
        case 41:
        case 42:
        case 43:
            return true
    }

    return false
}

// ----------------------------------------------------------------------------
// Secondary
// ----------------------------------------------------------------------------

// These key values are simply for sorting purposes and do not correspond to anything in-game
export const ALL_SECONDARIES = [
    {
        label: 'Crit',
        key: 0,
    },
    {
        label: 'Haste',
        key: 1,
    },
    {
        label: 'Mastery',
        key: 2,
    },
    {
        label: 'Versatility',
        key: 3,
    },
] as const

export const SECONDARY = {
    CRIT: ALL_SECONDARIES[0].key,
    HASTE: ALL_SECONDARIES[1].key,
    MASTERY: ALL_SECONDARIES[2].key,
    VERS: ALL_SECONDARIES[3].key,
} as const

export type Secondary = typeof ALL_SECONDARIES[number]['key']
