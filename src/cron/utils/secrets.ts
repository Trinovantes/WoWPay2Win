import fs from 'fs'
import { config } from 'dotenv'

// Loads .env into process.env
config()

export enum Secrets {
    CLIENT_ID = 'CLIENT_ID',
    CLIENT_SECRET = 'CLIENT_SECRET',
}

const secretsCache = new Map<Secrets, string>()

export function getSecret(key: Secrets): string {
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
