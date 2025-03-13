import { TierConfig, TierConfigMap } from '@/common/Boe'
import { TIERS_CONFIG_DIR } from '@/common/Constants'
import fs from 'node:fs/promises'
import path from 'node:path'

export async function getTierConfigMap(): Promise<TierConfigMap> {
    const tierConfigs = new Array<TierConfig>()
    const fileNames = await fs.readdir(TIERS_CONFIG_DIR)

    // Reverse since we want newest raid (last in filesystem) first
    for (const fileName of fileNames.toSorted().toReversed()) {
        const filePath = path.resolve(TIERS_CONFIG_DIR, fileName)
        const tierConfig = await import(filePath) as { default: TierConfig }
        tierConfigs.push(tierConfig.default)
    }

    return new Map(tierConfigs.map((config) => [config.slug, config]))
}
