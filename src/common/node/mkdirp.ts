import fs from 'node:fs'

export function mkdirp(path: string): void {
    if (!fs.existsSync(path)) {
        console.info(`Running mkdirp "${path}" (does not exist)`)
        fs.mkdirSync(path, { recursive: true })
    }
}
