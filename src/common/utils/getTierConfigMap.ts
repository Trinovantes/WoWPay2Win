import type { TierConfigMap, TierConfig } from '../Boe.ts'
import { TIERS_CONFIG_DIR } from '../Constants.ts'

async function getTierConfigMap(): Promise<TierConfigMap> {
    const tierConfigs = new Array<TierConfig>()

    if (__IS_WEBPACK__) {
        const tierConfigsImportCtx = require.context(__TIERS_CONFIG_DIR__, true, /\d{2}-\d{2}-[\w-]+\.ts$/) // Webpack specific function

        for (const fileName of tierConfigsImportCtx.keys()) {
            const configFile = tierConfigsImportCtx(fileName) as { default: TierConfig }
            tierConfigs.push(configFile.default)
        }
    } else {
        const fs = await import('node:fs/promises')
        const path  = await import('node:path')
        const fileNames = await fs.readdir(TIERS_CONFIG_DIR)

        for (const fileName of fileNames.toSorted()) {
            const filePath = path.resolve(TIERS_CONFIG_DIR, fileName)
            const tierConfig = await import(filePath) as { default: TierConfig }
            tierConfigs.push(tierConfig.default)
        }
    }

    // Reverse since we want newest raid first (last in filesystem)
    return new Map(tierConfigs.toReversed().map((config) => [config.slug, config]))
}

export const tierConfigMap = await getTierConfigMap()
export const defaultTier = [...tierConfigMap.keys()][0]
