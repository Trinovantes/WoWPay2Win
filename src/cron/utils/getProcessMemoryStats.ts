import { memoryUsage } from 'process'

export function getProcessMemoryStats(): string {
    const usage = memoryUsage()
    return `${usage.heapTotal / (1024 * 1024)}MiB`
}
