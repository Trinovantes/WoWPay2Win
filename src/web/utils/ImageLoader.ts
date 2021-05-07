import { Tier, TIER_CONFIGS } from '@/common/Constants'

// ----------------------------------------------------------------------------
// Load Data
// ----------------------------------------------------------------------------

function getTierIcons() {
    const imgReq = require.context('@/web/assets/img/tiers', false, /\.(jpe?g|png|gif|svg)$/i)
    const images: Record<string, string> = {}

    for (const imageName of imgReq.keys()) {
        const img64 = imgReq(imageName) as string
        images[imageName.replace('./', '')] = img64
    }

    return images
}

function getItemIcons() {
    const imgReq = require.context('@/web/assets/img/items', false, /\.(jpe?g|png|gif|svg)$/i)
    const images: Record<string, string> = {}

    for (const imageName of imgReq.keys()) {
        const img64 = imgReq(imageName) as string
        images[imageName.replace('./', '')] = img64
    }

    return images
}

const tierIcons = getTierIcons()
const itemIcons = getItemIcons()

// ----------------------------------------------------------------------------
// Exports
// ----------------------------------------------------------------------------

export function getTierIcon(tier: Tier): string | null {
    const iconFile = TIER_CONFIGS[tier].iconPath
    if (!(iconFile in tierIcons)) {
        console.warn('Image file not found during compilation', iconFile)
        return null
    }

    return tierIcons[iconFile]
}

export function getItemIcon(itemId: number): string | null {
    const iconFile = `${itemId}.jpg`
    if (!(iconFile in itemIcons)) {
        console.warn('Image file not found during compilation', iconFile)
        return null
    }

    return itemIcons[iconFile]
}
