export function deepFreeze<T>(obj: T): T {
    if (typeof obj !== 'object') {
        return obj
    }

    if (obj === null) {
        return obj
    }

    for (const key of Object.getOwnPropertyNames(obj) as Array<keyof T>) {
        if (typeof obj[key] === 'object') {
            obj[key] = deepFreeze(obj[key])
        }
    }

    return Object.freeze(obj)
}
