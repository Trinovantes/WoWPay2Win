import querystring from 'querystring'
import type { BnetOauthResponse } from '@/cron/api/Responses'
import type { Region } from '@/cron/models/Region'
import { getSecret, Secrets } from '@/cron/utils/secrets'
import { tryExponentialBackoff } from '@/cron/utils/tryExponentialBackoff'
import type { IncomingMessage } from 'http'

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

        const response = await tryExponentialBackoff<BnetOauthResponse>({
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

        return response.access_token
    }

    async fetch(isValidResponse?: (data: T | null) => string | null): Promise<T | null> {
        const url = this.endpoint.replace(this.region.config.apiHost, '')
        console.debug('Fetching', url)

        const response = await tryExponentialBackoff<T>({
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

        return response
    }

    static async fetchFile(fileUrl: string): Promise<IncomingMessage | null> {
        const response = await tryExponentialBackoff<IncomingMessage>({
            method: 'GET',
            url: fileUrl,
            responseType: 'stream',
        })

        return response
    }
}
