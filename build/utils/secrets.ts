import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

// Loads .env into process.env
config()

enum Secrets {
    GIT_HASH = 'GIT_HASH',
}

function getSecret(key: string): string {
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

    return getSecret(Secrets.GIT_HASH)
}
