import fs from 'node:fs'

export type RuntimeSecret =
    | 'CLIENT_ID'
    | 'CLIENT_SECRET'

const secretsCache = new Map<RuntimeSecret, string>()

export function getRuntimeSecret(key: RuntimeSecret): string {
    // Check if it's already defined in process.env
    const envValue = process.env[key]
    if (envValue) {
        return envValue
    }

    // Check if it's in the cache
    if (secretsCache.has(key)) {
        const cachedSecret = secretsCache.get(key)
        if (cachedSecret) {
            return cachedSecret
        }
    }

    // Check if it exists as a runtime secret via Docker
    const secretsFile = `/run/secrets/${key}`
    if (fs.existsSync(secretsFile)) {
        const secret = fs.readFileSync(secretsFile).toString('utf-8')
        secretsCache.set(key, secret)
        return secret
    }

    // Cannot find the secret anywhere
    throw new Error(`Cannot find ${key}`)
}
