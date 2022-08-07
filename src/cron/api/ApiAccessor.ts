import { getRuntimeSecret, RuntimeSecret } from '../utils/RuntimeSecret'
import { ResponseValidator, tryExponentialBackoff } from '../utils/tryExponentialBackoff'
import type { RegionConfig } from '@/common/RegionConfig'
import type { BnetOauthResponse } from '../api/BnetResponse'

export class ApiAccessor {
    readonly regionConfig: RegionConfig
    #accessToken?: string

    constructor(regionConfig: RegionConfig) {
        this.regionConfig = regionConfig
    }

    async #fetchAccessToken(): Promise<void> {
        if (this.#accessToken) {
            return
        }

        const clientId = getRuntimeSecret(RuntimeSecret.CLIENT_ID)
        const clientSecret = getRuntimeSecret(RuntimeSecret.CLIENT_SECRET)
        const data = new URLSearchParams({ grant_type: 'client_credentials' }).toString()

        console.info('Fetching', this.regionConfig.oauthEndpoint)
        const response = await tryExponentialBackoff<BnetOauthResponse>({
            method: 'POST',
            url: this.regionConfig.oauthEndpoint,
            data,
            auth: {
                username: clientId,
                password: clientSecret,
            },
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
    async fetch<T>(endpoint: string, isDynamic: boolean, isValidResponse?: ResponseValidator<T>): Promise<T | null> {
        await this.#fetchAccessToken()

        const url = this.regionConfig.apiHost + endpoint
        console.info('Fetching', url)

        const response = await tryExponentialBackoff<T>({
            method: 'GET',
            url,
            headers: {
                Authorization: `Bearer ${this.#accessToken}`,
            },
            params: {
                regionSlug: this.regionConfig.slug,
                locale: this.regionConfig.locale,
                namespace: `${isDynamic ? 'dynamic' : 'static'}-${this.regionConfig.slug}`,
            },
        }, isValidResponse)

        return response
    }
}
