export const APP_NAME = 'WoWPay2Win'
export const APP_DESC = 'This tool scans for BoEs in every auction house in each region.'
export const OG_DESC = 'Tired of being bad in World of Warcraft? Just swipe your credit card and buy your BiS gear off the auction house!'

export const CACHE_DURATION = 52 // weeks
export const API_TIMEOUT = 30 * 1000 // in ms
export const MAX_API_ATTEMPTS = 5

export const GOLD_CAP = 10 * 1000 * 1000
export const ROWS_PER_PAGE = 20

export const SENTRY_DSN = 'https://ba1fbe840db046beb61f9ae59e888924@o504161.ingest.sentry.io/5590531'

export const PROXY_URL_DEV = 'http://localhost:3000'
export const PROXY_URL_PROD = 'https://wowpay2win.trinovantes.workers.dev'
export const PROXY_TARGET_URL_HEADER = 'x-target-url'
export const PROXY_REQUEST_HEADERS = [
    'content-type',
    'authorization',
]
export const PROXY_RESPONSE_HEADERS = [
    'content-type',
    'cache-control',
]
