import axios, { AxiosRequestConfig } from 'axios'
import { sleep } from '@/common/utils'
import { API_TIMEOUT, MAX_API_RETRIES } from '@/common/Constants'

export async function tryExponentialBackoff<T>(request: AxiosRequestConfig, isValidResponse?: (data: T | null) => string | null): Promise<T | null> {
    // Retry with exponential backoff if server is temporarily unavilable
    for (let attempt = 0; attempt < MAX_API_RETRIES; attempt++) {
        const timeout = axios.CancelToken.source()
        const timeoutId = setTimeout(() => {
            timeout.cancel(`Request timeout: ${request.url}`)
        }, API_TIMEOUT)

        try {
            const response = await axios({
                ...request,
                cancelToken: timeout.token,
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
            const delay = Math.round(Math.exp(attempt) * 1000)

            const isMaxAttempts = (attempt === MAX_API_RETRIES - 1)
            const retryMsg = isMaxAttempts ? '' : `Retrying after ${delay}ms`

            console.warn(error.message, retryMsg)
            if (!isMaxAttempts) {
                await sleep(delay)
            }
        } finally {
            clearTimeout(timeoutId)
        }
    }

    // If after all our attempts and the op fails, the script should proceed assuming no data
    return null
}
