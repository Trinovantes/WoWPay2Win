import Axios, { AxiosResponse } from 'axios'
import querystring from 'querystring'

import { Region } from '../models/Region'
import Constants from '@common/Constants'
import { sleep } from '@common/utils'
import { IncomingMessage } from 'http'

export class APIAccessor<T> {
    readonly endpoint: string
    readonly isDynamic: boolean
    readonly region: Region

    constructor(endpoint: string, isDynamic: boolean, region: Region) {
        this.endpoint = endpoint
        this.isDynamic = isDynamic
        this.region = region
    }

    private get accessToken(): string {
        if (!this.region.accessToken) {
            throw new Error('Region does not have accessToken')
        }

        return this.region.accessToken
    }

    async fetchAccessToken(): Promise<string> {
        const user = process.env.CLIENT_ID
        const pass = process.env.CLIENT_SECRET
        if (!user || !pass) {
            throw new Error('Cannnot find CLIENT_ID or CLIENT_SECRET in env')
        }

        console.debug('Fetching', this.region.config.oauthEndpoint)

        const response = await tryExponentialBackoff(async() => {
            return await Axios.post(this.region.config.oauthEndpoint, querystring.stringify({
                grant_type: 'client_credentials',
            }), {
                timeout: Constants.API_TIMEOUT,
                auth: {
                    username: user,
                    password: pass,
                },
            })
        })

        if (response) {
            const data = response.data as { 'access_token': string }
            return data.access_token
        } else {
            return ''
        }
    }

    async fetch(shouldRetry?: (data: T | null) => string | null): Promise<T | null> {
        console.debug('Fetching', this.endpoint.replace(this.region.config.apiHost, ''))

        // This will throw an error if status is not 200
        const response = await tryExponentialBackoff(async() => {
            const response = await Axios.get(this.endpoint, {
                timeout: Constants.API_TIMEOUT,
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                },
                params: {
                    regionSlug: this.region.config.slug,
                    locale: this.region.config.locale,
                    namespace: `${this.isDynamic ? 'dynamic' : 'static'}-${this.region.config.slug}`,
                },
            })

            if (shouldRetry) {
                const errorMessage = shouldRetry(response?.data)
                if (errorMessage) {
                    throw new Error(errorMessage)
                }
            }

            return response
        })

        return response?.data as T
    }

    static async fetchFile(fileUrl: string): Promise<IncomingMessage | null> {
        const response = await tryExponentialBackoff(async() => {
            return await Axios.get(fileUrl, {
                timeout: Constants.API_TIMEOUT,
                responseType: 'stream',
            })
        })

        return response?.data as IncomingMessage
    }
}

async function tryExponentialBackoff(request: () => Promise<AxiosResponse | null>): Promise<AxiosResponse | null> {
    // Retry with exponential back-off if server is temporarily unavilable
    for (let attempt = 0; attempt < Constants.MAX_API_RETRIES; attempt++) {
        try {
            // If errorProneFunction didn't throw, then we can exit the loop early
            return await request()
        } catch (err) {
            const error = err as Error
            const delay = Math.round(Math.exp(attempt) * 1000)

            const isMaxAttempts = (attempt === Constants.MAX_API_RETRIES - 1)
            const retryMsg = isMaxAttempts ? '' : `Retrying after ${delay}ms`

            console.info(error.message, retryMsg)
            await sleep(delay)
        }
    }

    // If after all our attempts and the op fails, the script should proceed assuming no data
    return null
}
