import { CONCURRENT_API_REQUESTS } from '@/common/Constants'

export async function batchRequests(numReq: number, request: (idx: number) => Promise<void>): Promise<void> {
    let offset = 0

    while (offset < numReq) {
        const queuedRequests: Array<Promise<void>> = []

        for (let i = 0; i < CONCURRENT_API_REQUESTS; i++) {
            const idx = offset + i
            if (idx >= numReq) {
                break
            }

            queuedRequests.push(request(idx))
        }

        await Promise.all(queuedRequests)
        offset += CONCURRENT_API_REQUESTS
    }
}
