import { IlvlRange, Tier, TIER_CONFIGS } from './Constants'

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

export function deepFreeze<T>(obj: T): T {
    if (typeof obj !== 'object') {
        return obj
    }

    for (const key of Object.getOwnPropertyNames(obj) as Array<keyof T>) {
        if (typeof obj[key] === 'object') {
            obj[key] = deepFreeze(obj[key])
        }
    }

    return Object.freeze(obj)
}

export function getIlvlRange(tier: Tier): IlvlRange {
    return Object.assign({}, TIER_CONFIGS[tier].ilvls)
}

export function getTierBoeIds(tier: Tier): Array<number> {
    const tierConfig = TIER_CONFIGS[tier]
    const boeIds: Array<number> = []

    for (const category of tierConfig.boes) {
        for (const id of category.ids) {
            boeIds.push(id)
        }
    }

    return boeIds
}

export function getAllBoeIds(): Array<number> {
    const boeIds: Array<number> = []

    for (const tier of Object.keys(TIER_CONFIGS)) {
        boeIds.push(...getTierBoeIds(tier as Tier))
    }

    return boeIds
}
