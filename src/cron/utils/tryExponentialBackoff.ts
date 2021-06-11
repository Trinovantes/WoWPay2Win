import axios, { AxiosRequestConfig } from 'axios'
import { API_TIMEOUT, MAX_API_ATTEMPTS } from '@/common/Constants'
import { sleep } from '@/common/utils'

export async function tryExponentialBackoff<T>(request: AxiosRequestConfig, isValidResponse?: (data: T | null) => string | null): Promise<T | null> {
    // Retry with exponential backoff if server is temporarily unavilable
    for (let attempt = 1; attempt <= MAX_API_ATTEMPTS; attempt++) {
        const timeout = axios.CancelToken.source()
        const timeoutId = setTimeout(() => {
            timeout.cancel(`Request timeout: ${request.url}`)
        }, API_TIMEOUT)

        try {
            const response = await axios({
                cancelToken: timeout.token,
                ...request,
            })

            if (response.status !== 200) {
                throw new Error(`Request returned ${response.status}: ${JSON.stringify(response.data)}`)
            }

            const errorMessage = isValidResponse?.(response?.data)
            if (errorMessage) {
                throw new Error(errorMessage)
            }

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
