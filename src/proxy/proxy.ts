import { PROXY_REQUEST_HEADERS, PROXY_RESPONSE_HEADERS, PROXY_TARGET_URL_HEADER } from '@/common/Constants'
import { regionConfigs } from '@/common/RegionConfig'
import type { ExportedHandler, Request as CfRequest, Response as CfResponse } from '@cloudflare/workers-types'

const allowedOrigins = new Set([
    ...regionConfigs.map((region) => new URL(region.apiHost).origin),
    ...regionConfigs.map((region) => new URL(region.oauthEndpoint).origin),
])

const allowedMethods = new Set([
    'GET',
    'POST',
])

const handler: ExportedHandler = {
    async fetch(request) {
        if (!allowedMethods.has(request.method)) {
            return new Response('Invalid method', { status: 400 }) as unknown as CfResponse
        }

        const targetUrl = request.headers.get(PROXY_TARGET_URL_HEADER)
        if (!targetUrl) {
            return new Response('Invalid targetUrl', { status: 400 }) as unknown as CfResponse
        }

        const targetOrigin = new URL(targetUrl).origin
        if (!allowedOrigins.has(targetOrigin)) {
            return new Response('Invalid origin', { status: 400 }) as unknown as CfResponse
        }

        console.info(`Proxying [${targetUrl}]`)
        const proxyReq = copyRequest(request, targetUrl)
        const proxyRes = await fetch(proxyReq)
        return copyResponse(proxyRes)
    },
}

export default handler

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

export function copyRequest(origRequest: CfRequest, targetUrl: string): Request {
    const proxyReq = new Request(targetUrl, {
        method: origRequest.method,
        body: origRequest.body as unknown as BodyInit,
    })

    for (const headerKey of PROXY_REQUEST_HEADERS) {
        const headerValue = origRequest.headers.get(headerKey)
        if (!headerValue) {
            continue
        }

        proxyReq.headers.append(headerKey, headerValue)
    }

    return proxyReq
}

export function copyResponse(origResponse: Response): CfResponse {
    const proxyRes = new Response(origResponse.body, {
        status: origResponse.status,
        statusText: origResponse.statusText,
    })

    for (const headerKey of PROXY_RESPONSE_HEADERS) {
        const headerValue = origResponse.headers.get(headerKey)
        if (!headerValue) {
            continue
        }

        proxyRes.headers.set(headerKey, headerValue)
    }

    return proxyRes as unknown as CfResponse
}
