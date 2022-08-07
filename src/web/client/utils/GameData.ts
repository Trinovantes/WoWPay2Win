import type { Item, Region } from '@/common/Cache'
import type { RegionSlug } from '@/common/RegionConfig'

function getRegionFiles(): Map<RegionSlug, Region> {
    const req = require.context('@/web/client/assets/data', false, /region-(\w+)\.json$/)
    const files = new Map<RegionSlug, Region>()

    for (const fileName of req.keys()) {
        const matches = /region-(\w+)\.json$/.exec(fileName)
        if (!matches) {
            throw new Error(`Failed to match region "${fileName}"`)
        }

        const regionSlug = matches[1] as RegionSlug
        files.set(regionSlug, req(fileName) as Region)
    }

    return files
}

function getItemFiles(): Map<number, Item> {
    const req = require.context('@/web/client/assets/data', false, /item-(\d+)\.json$/)
    const files = new Map<number, Item>()

    for (const fileName of req.keys()) {
        const matches = /item-(\d+)\.json$/.exec(fileName)
        if (!matches) {
            throw new Error(`Failed to match itemId "${fileName}"`)
        }

        const itemId = Number(matches[1])
        if (isNaN(itemId)) {
            throw new Error('Invalid item id while parsing item file')
        }

        files.set(itemId, req(fileName) as Item)
    }

    return files
}

export const regionFiles = getRegionFiles()
export const itemFiles = getItemFiles()
