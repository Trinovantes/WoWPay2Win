import fs from 'node:fs'

export function mkdirp(path: string): void {
    if (!fs.existsSync(path)) {
        console.info(`${path} does not exist. Attempting to mkdir`)
        fs.mkdirSync(path, { recursive: true })
    }
}
