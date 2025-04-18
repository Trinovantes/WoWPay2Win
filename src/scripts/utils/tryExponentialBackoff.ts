import { API_TIMEOUT, MAX_API_ATTEMPTS } from '@/common/Constants'
import { sleep } from '@/common/utils/sleep'

export type ResponseValidator<T> = (data: T | null) => string | null

export async function tryExponentialBackoff<T>(targetUrl: string, requestConfig: RequestInit, isValidResponse?: ResponseValidator<T>): Promise<T | null> {
    for (let attempt = 0; attempt < MAX_API_ATTEMPTS; attempt++) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
            console.warn(`Request timeout: ${targetUrl}`)
            controller.abort()
        }, API_TIMEOUT)

        try {
            console.info(`Attempt:${attempt} Fetching:${targetUrl}`)
            const response = await fetch(targetUrl, {
                signal: controller.signal,
                ...requestConfig,
            })

            if (response.status !== 200) {
                throw new Error(`status:${response.status} data:${await response.text()}`)
            }

            const data = await response.json() as T
            const errorMessage = isValidResponse?.(data)
            if (errorMessage) {
                throw new Error(errorMessage)
            }

            console.info(`Attempt:${attempt} Fetching:${targetUrl} SUCCEEDED`)
            return data
        } catch (err) {
            const error = err as Error
            console.warn(error)

            if (attempt < MAX_API_ATTEMPTS) {
                const delay = Math.round(Math.exp(attempt) * 1000)
                console.warn(`Retrying after ${delay}ms`)
                await sleep(delay)
            }
        } finally {
            clearTimeout(timeoutId)
        }
    }

    // If after all our attempts and the op fails, the script should proceed assuming no data
    return null
}
