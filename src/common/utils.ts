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

export async function tryExponentialBackoff<T = void>(errorProneFunction: () => Promise<T>): Promise<T | undefined> {
    // Retry with exponential back-off if server is temporarily unavilable
    for (let attempt = 0; attempt < Constants.MAX_API_RETRIES; attempt++) {
        try {
            // If errorProneFunction didn't throw, then we can exit the loop early
            return await errorProneFunction()
        } catch (err) {
            const error = err as Error
            const delay = Math.round(Math.exp(attempt) * 1000)

            console.warn(error.message, `Retrying after ${delay}ms`)
            if (Constants.IS_DEV) {
                console.warn(error.stack)
            }

            await sleep(delay)
        }
    }

    // If after all our attempts and the op fails, the script should proceed assuming no data
    return undefined
}
