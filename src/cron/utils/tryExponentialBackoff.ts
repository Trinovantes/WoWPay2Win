import axios, { AxiosRequestConfig } from 'axios'
import { API_TIMEOUT, MAX_API_ATTEMPTS } from '@/common/Constants'
import { sleep } from '@/common/utils/sleep'

export type ResponseValidator<T> = (data: T | null) => string | null

export async function tryExponentialBackoff<T>(request: AxiosRequestConfig, isValidResponse?: ResponseValidator<T>): Promise<T | null> {
    for (let attempt = 0; attempt < MAX_API_ATTEMPTS; attempt++) {
        const timeout = axios.CancelToken.source()
        const timeoutId = setTimeout(() => {
            timeout.cancel(`Request timeout: ${request.url}`)
        }, API_TIMEOUT)

        try {
            console.info(`Attempt:${attempt} Fetching:${request.url}`)
            const response = await axios({
                cancelToken: timeout.token,
                ...request,
            })

            const errorMessage = isValidResponse?.(response?.data as T)
            if (errorMessage) {
                throw new Error(errorMessage)
            }

            console.info(`Attempt:${attempt} Fetching:${request.url} SUCCEEDED`)
            return response.data as T
        } catch (err) {
            const error = err as Error
            console.warn(error.message)

            if (axios.isAxiosError(err)) {
                console.warn('Error Response Data:', err.response?.data)
            }

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
