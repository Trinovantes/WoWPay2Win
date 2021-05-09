/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { IlvlRange, Tier, TIER_CONFIGS } from './Constants'

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms)
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

export function getIlvlRange(tier: Tier | null): IlvlRange {
    if (!tier) {
        return {
            min: Number.MIN_SAFE_INTEGER,
            max: Number.MAX_SAFE_INTEGER,
        }
    }

    return Object.assign({}, TIER_CONFIGS[tier].ilvls)
}

export function getTierBoeIds(tier: Tier | null): Array<number> {
    if (!tier) {
        return []
    }

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
