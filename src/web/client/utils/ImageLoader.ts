import { Tier, tierConfigs } from '@/common/Boe'

// ----------------------------------------------------------------------------
// Load Data
// ----------------------------------------------------------------------------

function getTierIcons() {
    const imgReq = require.context('@/web/client/assets/img/tiers', false, /\.(jpe?g|png|gif|svg)$/i)
    const images = new Map<string, string>()

    for (const imageName of imgReq.keys()) {
        const img64 = imgReq(imageName) as string
        const fileName = imageName.replace('./', '')
        images.set(fileName, img64)
    }

    return images
}

function getItemIcons() {
    const imgReq = require.context('@/web/client/assets/img/items', false, /\.(jpe?g|png|gif|svg)$/i)
    const images = new Map<string, string>()

    for (const imageName of imgReq.keys()) {
        const img64 = imgReq(imageName) as string
        const fileName = imageName.replace('./', '')
        images.set(fileName, img64)
    }

    return images
}

const tierIcons = getTierIcons()
const itemIcons = getItemIcons()

// ----------------------------------------------------------------------------
// Exports
// ----------------------------------------------------------------------------

export function getTierIcon(tier: Tier): string | undefined {
    const iconFile = tierConfigs.get(tier)?.iconName ?? ''
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
