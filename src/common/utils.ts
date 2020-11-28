import Constants from '@common/Constants'

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}

export async function batchRequests(numReq: number, request: (idx: number) => Promise<void>): Promise<void> {
    let offset = 0

    while (offset < numReq) {
        const queuedRequests: Array<Promise<void>> = []

        for (let i = 0; i < Constants.CONCURRENT_API_REQUESTS; i++) {
            const idx = offset + i
            if (idx >= numReq) {
                break
            }

            queuedRequests.push(request(idx))
        }

        await Promise.all(queuedRequests)
        offset += Constants.CONCURRENT_API_REQUESTS
    }
}

export function setEq<T>(s1: Set<T>, s2: Set<T>): boolean {
    if (s1.size !== s2.size) {
        return false
    }

    for (const el of s1) {
        if (!s2.has(el)) {
            return false
        }
    }

    return true
}
