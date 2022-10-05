import type { FilterState } from './Filter'

export enum HydrationKey {
    FILTER = '__INITIAL_FILTER_STATE__',
}

type HydrationStateMap = {
    [HydrationKey.FILTER]: FilterState
}

export function saveStateToLocalStorage<K extends keyof HydrationStateMap>(key: K, state: HydrationStateMap[K]): void {
    const stateString = JSON.stringify(state, replacer)
    localStorage.setItem(key, stateString)
}

export function loadStateFromLocalStorage<K extends keyof HydrationStateMap>(key: K): HydrationStateMap[K] | undefined {
    const state = localStorage.getItem(key)
    if (!state) {
        return
    }

    return JSON.parse(state, reviver) as HydrationStateMap[K]
}

export function cleanLocalStorage(): void {
    const hydrationKeys = Object.values(HydrationKey)

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (!key) {
            continue
        }

        if (hydrationKeys.includes(key as HydrationKey)) {
            continue
        }

        console.info(`Removing "${key}" from localStorage`)
        localStorage.removeItem(key)
    }
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function replacer(key: unknown, value: unknown): unknown {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: [...value.entries()],
        }
    } else if (value instanceof Set) {
        return {
            dataType: 'Set',
            value: [...value],
        }
    } else {
        return value
    }
}

function reviver(key: unknown, value: unknown): unknown {
    if (typeof value !== 'object' || value === null) {
        return value
    }

    if (!('dataType' in value && 'value' in value)) {
        return value
    }

    const typedValue = value as { dataType: string; value: unknown }
    switch (typedValue.dataType) {
        case 'Map': {
            return new Map(typedValue.value as Array<[unknown, unknown]>)
        }
        case 'Set': {
            return new Set(typedValue.value as Array<[unknown]>)
        }
    }

    return value
}
