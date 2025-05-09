import { Tier, TierConfigMap } from '@/common/Boe'

// ----------------------------------------------------------------------------
// Load Data
// ----------------------------------------------------------------------------

const tierIcons: Map<string, string> = (() => {
    const imgReq = require.context(DEFINE.TIERS_ICON_DIR, false, /\.(jpe?g|png|gif|svg)$/i) // Webpack specific function
    const images = new Map<string, string>()

    for (const imageName of imgReq.keys()) {
        const img64 = imgReq(imageName) as string
        const fileName = imageName.replace('./', '')
        images.set(fileName, img64)
    }

    return images
})()

const itemIcons: Map<string, string> = (() => {
    const imgReq = require.context(DEFINE.ITEMS_ICON_DIR, false, /\.(jpe?g|png|gif|svg)$/i) // Webpack specific function
    const images = new Map<string, string>()

    for (const imageName of imgReq.keys()) {
        const img64 = imgReq(imageName) as string
        const fileName = imageName.replace('./', '')
        images.set(fileName, img64)
    }

    return images
})()

// ----------------------------------------------------------------------------
// Exports
// ----------------------------------------------------------------------------

export function getTierIcon(tierConfigMap: TierConfigMap, tier: Tier): string | undefined {
    const iconFile = tierConfigMap.get(tier)?.iconName ?? ''
    if (!tierIcons.has(iconFile)) {
        console.warn('Image file not found during compilation', iconFile)
        return undefined
    }

    return tierIcons.get(iconFile)
}

export function getItemIcon(itemId: number): string | undefined {
    const iconFile = `${itemId}.jpg`
    if (!itemIcons.has(iconFile)) {
        console.warn('Image file not found during compilation', iconFile)
        return undefined
    }

    return itemIcons.get(iconFile)
}
