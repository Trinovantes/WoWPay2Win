import fs from 'node:fs'

export async function fetchFile(fileUrl: string, destPath: string): Promise<void> {
    try {
        console.info(`Starting to download ${fileUrl} to ${destPath}`)
        const response = await fetch(fileUrl)

        const fileStream = fs.createWriteStream(destPath)
        await response.body?.pipeTo(new WritableStream<Uint8Array>({
            write: (chunk) => {
                fileStream.write(chunk)
            },
            close: () => {
                console.info(`File writer finished ${fileUrl}`)
            },
            abort: (err: Error) => {
                console.warn(`File writer encountered an error ${fileUrl}: ${err.message}`)
            },
        }))
    } catch (err) {
        console.warn(`Failed to download ${fileUrl} to ${fileUrl}`, err)
    }
}
