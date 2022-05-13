import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { config } from 'dotenv'

// Loads .env into process.env
config()

export enum BuildSecret {
    GIT_HASH = 'GIT_HASH',
    APP_URL = 'APP_URL',
    APP_PORT = 'APP_PORT',
}

export function getBuildSecret(key: string): string {
    // Check if it's already defined in process.env
    const envValue = process.env[key]
    if (envValue) {
        return envValue
    }

    // Check if it exists as a runtime secret via Docker
    const secretsFile = `/run/secrets/${key}`
    if (fs.existsSync(secretsFile)) {
        const secret = fs.readFileSync(secretsFile)
        return secret.toString('utf-8')
    }

    // Cannot find the secret anywhere
    throw new Error(`Cannot find ${key}`)
}

export function getGitHash(rootDir: string): string {
    const gitDir = path.resolve(rootDir, '.git')
    if (fs.existsSync(gitDir)) {
        return execSync('git rev-parse HEAD').toString().trim()
    }

    return getBuildSecret(BuildSecret.GIT_HASH)
}
