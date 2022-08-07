import { tryExponentialBackoff } from './tryExponentialBackoff'
import type { IncomingMessage } from 'http'

export async function fetchFile(fileUrl: string): Promise<IncomingMessage | null> {
    const response = await tryExponentialBackoff<IncomingMessage>({
        method: 'GET',
        url: fileUrl,
        responseType: 'stream',
    })

    return response
}
