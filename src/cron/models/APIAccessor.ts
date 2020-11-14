import Axios from 'axios'
import querystring from 'querystring'

import { Region } from './Region'
import Constants from '@common/Constants'

export type onReceiveFn = (data: unknown) => Promise<void>

export class APIAccessor {
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

        console.debug('Trying to get access token', this.region.config.oauthEndpoint)

        const response = await Axios.post(this.region.config.oauthEndpoint, querystring.stringify({
            grant_type: 'client_credentials',
        }), {
            auth: {
                username: user,
                password: pass,
            },
        })

        const data = response.data as { 'access_token': string }
        return data.access_token
    }

    async fetch(onReceive: onReceiveFn): Promise<void> {
        console.debug('Fetching', this.endpoint.replace(this.region.config.apiHost, ''))
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

        if (response.status !== 200) {
            throw new Error(`Failed to access ${this.endpoint}`)
        }

        await onReceive(response.data)
    }
}
