import { Tier, TierConfig, TierConfigMap } from '@/common/Boe'
import { Item, Region } from '@/common/Cache'
import { RegionSlug } from '@/common/RegionConfig'

export const regionDataFiles: Map<RegionSlug, Region> = (() => {
    const req = require.context(DEFINE.REGIONS_DATA_DIR, false, /region-(\w+)\.json$/) // Webpack specific function
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
})()

export const itemDataFiles: Map<number, Item> = (() => {
    const req = require.context(DEFINE.ITEMS_DATA_DIR, false, /item-(\d+)\.json$/) // Webpack specific function
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
})()

export const { tierConfigMap, defaultTier } = (() => {
    const tierConfigsImportCtx = require.context(DEFINE.TIERS_CONFIG_DIR, true, /\d{2}-\d{2}-[\w-]+\.ts$/) // Webpack specific function
    const tierConfigs = new Array<TierConfig>()

    for (const fileName of tierConfigsImportCtx.keys()) {
        const configFile = tierConfigsImportCtx(fileName) as { default: TierConfig }
        tierConfigs.push(configFile.default)
    }

    const tierConfigMap: TierConfigMap = new Map(tierConfigs.toReversed().map((config) => [config.slug, config]))
    const defaultTier: Tier = tierConfigs[tierConfigs.length - 1].slug

    return {
        tierConfigMap,
        defaultTier,
    }
})()
