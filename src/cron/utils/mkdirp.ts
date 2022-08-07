import { existsSync, mkdirSync } from 'fs'

export function mkdirp(path: string): void {
    if (!existsSync(path)) {
        console.info(`${path} does not exist. Attempting to mkdir`)
        mkdirSync(path, { recursive: true })
    }
}
