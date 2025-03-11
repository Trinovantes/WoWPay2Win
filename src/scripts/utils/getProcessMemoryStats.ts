import process from 'node:process'

export function getProcessMemoryStats(): string {
    const usage = process.memoryUsage()
    const f = (bytes: number): string => {
        return (bytes / (1024 * 1024)).toFixed(2)
    }

    return `total:${f(usage.heapTotal)}MiB used:${f(usage.heapUsed)}MiB`
}
