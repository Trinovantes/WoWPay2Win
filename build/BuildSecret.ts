import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { config } from 'dotenv'

// Loads .env into process.env
const envFile = process.env.ENV_FILE ?? '.env'
config({ path: envFile, quiet: true })

export type BuildSecret =
    | 'GIT_HASH'
    | 'WEBPACK_ANALYZE'
    | 'WEB_URL'
    | 'WEB_PORT'
    | 'API_URL'
    | 'API_PORT'

export function getBuildSecret(key: BuildSecret, defaultValue?: string): string {
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

    if (defaultValue) {
        return defaultValue
    }

    // Cannot find the secret anywhere
    throw new Error(`Cannot find ${key}`)
}

export function getGitHash(rootDir: string): string {
    const gitDir = path.resolve(rootDir, '.git')
    if (fs.existsSync(gitDir)) {
        return execSync('git rev-parse HEAD').toString().trim()
    }

    return getBuildSecret('GIT_HASH')
}

export function isAnalyze(): boolean {
    return getBuildSecret('WEBPACK_ANALYZE', 'false') === 'true'
}
