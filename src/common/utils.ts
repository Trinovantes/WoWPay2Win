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
