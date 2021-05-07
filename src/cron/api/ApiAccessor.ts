import querystring from 'querystring'
import { IncomingMessage } from 'http'
import { BnetOauthResponse } from '@/cron/api/Responses'
import { Region } from '@/cron/models/Region'
import { getSecret, Secrets } from '@/cron/utils/secrets'
import { tryExponentialBackoff } from '@/cron/utils/tryExponentialBackoff'

export class ApiAccessor<T> {
    readonly endpoint: string
    readonly isDynamic: boolean
    readonly region: Region

    constructor(endpoint: string, isDynamic: boolean, region: Region) {
        this.endpoint = endpoint
        this.isDynamic = isDynamic
        this.region = region
    }

    private get _accessToken(): string {
        if (!this.region.accessToken) {
            throw new Error('Region does not have accessToken')
        }

        return this.region.accessToken
    }

    async fetchAccessToken(): Promise<string> {
        const user = getSecret(Secrets.CLIENT_ID)
        const pass = getSecret(Secrets.CLIENT_SECRET)

        console.debug('Fetching', this.region.config.oauthEndpoint)

        const response = await tryExponentialBackoff({
            method: 'POST',
            url: this.region.config.oauthEndpoint,
            data: querystring.stringify({
                grant_type: 'client_credentials',
            }),
            auth: {
                username: user,
                password: pass,
            },
        })

        if (!response) {
            throw new Error('Failed to get access token')
        }

        if (response.status !== 200) {
            throw new Error(`Authentication returned ${response.status}: ${JSON.stringify(response.data)}`)
        }

        const data = response.data as BnetOauthResponse
        return data.access_token
    }

    async fetch(isValidResponse?: (data: T | null) => string | null): Promise<T | null> {
        const url = this.endpoint.replace(this.region.config.apiHost, '')
        console.debug('Fetching', url)

        // This will throw an error if status is not 200
        const response = await tryExponentialBackoff({
            method: 'GET',
            url: this.endpoint,
            headers: {
                Authorization: `Bearer ${this._accessToken}`,
            },
            params: {
                regionSlug: this.region.config.slug,
                locale: this.region.config.locale,
                namespace: `${this.isDynamic ? 'dynamic' : 'static'}-${this.region.config.slug}`,
            },
        }, isValidResponse)

        return response?.data as T
    }

    static async fetchFile(fileUrl: string): Promise<IncomingMessage | null> {
        const response = await tryExponentialBackoff({
            method: 'GET',
            url: fileUrl,
            responseType: 'stream',
        })

        return response?.data as IncomingMessage
    }
}
