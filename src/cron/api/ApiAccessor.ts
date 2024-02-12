import { getRuntimeSecret, RuntimeSecret } from '../utils/RuntimeSecret'
import { ResponseValidator, tryExponentialBackoff } from '../utils/tryExponentialBackoff'
import type { RegionConfig } from '@/common/RegionConfig'
import type { BnetOauthResponse } from '../api/BnetResponse'
import { PROXY_TARGET_URL_HEADER, PROXY_URL_DEV, PROXY_URL_PROD } from '@/common/Constants'

export class ApiAccessor {
    #accessToken?: string

    constructor(
        readonly regionConfig: RegionConfig,
        readonly proxyUrl = DEFINE.IS_DEV
            ? PROXY_URL_DEV
            : PROXY_URL_PROD,
    ) {
        // nop
    }

    async #fetchAccessToken(): Promise<void> {
        if (this.#accessToken) {
            return
        }

        const clientId = getRuntimeSecret(RuntimeSecret.CLIENT_ID)
        const clientSecret = getRuntimeSecret(RuntimeSecret.CLIENT_SECRET)
        const basicAuth = btoa(`${clientId}:${clientSecret}`)
        const config: RequestInit = {
            method: 'POST',
            body: new URLSearchParams({ grant_type: 'client_credentials' }),
            headers: {
                Authorization: `Basic ${basicAuth}`,
                [PROXY_TARGET_URL_HEADER]: this.regionConfig.oauthEndpoint,
            },
        }

        const response = await tryExponentialBackoff<BnetOauthResponse>(this.proxyUrl, this.regionConfig.oauthEndpoint, config, (res) => {
            if (!res?.access_token) {
                return 'Missing access_token in response'
            }

            return null
        })

        if (!response) {
            throw new Error('Failed to get access token')
        }

        this.#accessToken = response.access_token
    }

    /**
     * Calls Bnet API
     *
     * @param endpoint API path excluding the region prefix e.g. "/data/wow/item/1"
     * @param isDynamic Type of API request (check with docs)
     * @param isValidResponse Optional function to validate the returned result e.g. sometimes auctions endpoint return 200 but is malformed response
     */
    async fetch<T>(endpoint: string, isDynamic: boolean, isValidResponse: ResponseValidator<T>): Promise<T | null> {
        await this.#fetchAccessToken()

        const targetUrl = new URL(this.regionConfig.apiHost + endpoint)
        targetUrl.searchParams.set('region', this.regionConfig.slug)
        targetUrl.searchParams.set('locale', this.regionConfig.locale)
        targetUrl.searchParams.set('namespace', `${isDynamic ? 'dynamic' : 'static'}-${this.regionConfig.slug}`)

        const config: RequestInit = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.#accessToken}`,
                [PROXY_TARGET_URL_HEADER]: targetUrl.toString(),
            },
        }

        const response = await tryExponentialBackoff<T>(this.proxyUrl, targetUrl.toString(), config, isValidResponse)
        return response
    }
}
