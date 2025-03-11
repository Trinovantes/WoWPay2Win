import { TierConfig, TierConfigMap } from '@/common/Boe'
import { TIERS_CONFIG_DIR } from '@/common/Constants'
import { Glob } from 'bun'
import path from 'node:path'

export async function getTierConfigMap(): Promise<TierConfigMap> {
    const tierConfigs = new Array<TierConfig>()
    const filePaths = new Array<string>()
    const glob = new Glob(path.resolve(TIERS_CONFIG_DIR) + '/*.ts')

    for (const filePath of glob.scanSync('.')) {
        filePaths.push(filePath)
    }

    // Reverse since we want newest raid (last in filesystem) first
    for (const filePath of filePaths.toSorted().toReversed()) {
        const tierConfig = await import(filePath) as { default: TierConfig }
        tierConfigs.push(tierConfig.default)
    }

    return new Map(tierConfigs.map((config) => [config.slug, config]))
}
