import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { sleep } from '@/common/utils'
import { API_TIMEOUT, MAX_API_RETRIES } from '@/common/Constants'

export async function tryExponentialBackoff<T>(request: AxiosRequestConfig, isValidResponse?: (data: T | null) => string | null): Promise<AxiosResponse | null> {
    // Retry with exponential backoff if server is temporarily unavilable
    for (let attempt = 0; attempt < MAX_API_RETRIES; attempt++) {
        try {
            return await new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    reject(new Error(`Request timeout: ${request.url}`))
                }, API_TIMEOUT)

                axios(request)
                    .then((response) => {
                        const errorMessage = isValidResponse?.(response?.data)
                        if (errorMessage) {
                            throw new Error(errorMessage)
                        }

                        // If the request didn't throw, then we can exit the loop early
                        resolve(response)
                    })
                    .catch((err) => {
                        reject(err)
                    })
                    .finally(() => {
                        clearTimeout(timeoutId)
                    })
            })
        } catch (err) {
            const error = err as Error
            const delay = Math.round(Math.exp(attempt) * 1000)

            const isMaxAttempts = (attempt === MAX_API_RETRIES - 1)
            const retryMsg = isMaxAttempts ? '' : `Retrying after ${delay}ms`

            console.warn(error.message, retryMsg)
            await sleep(delay)
        }
    }

    // If after all our attempts and the op fails, the script should proceed assuming no data
    return null
}
