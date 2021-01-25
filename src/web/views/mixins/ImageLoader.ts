import { Component, Mixins, Vue } from 'vue-property-decorator'

import { Tier, TierConfigs } from '@common/Constants'

@Component
export class ImageLoader extends Mixins(Vue) {
    private readonly itemIcons = getItemIcons()
    private readonly tierIcons = getTierIcons()

    getItemIcon(itemId: number): unknown {
        const iconFile = `${itemId}.jpg`
        if (!(iconFile in this.itemIcons)) {
            console.warn('Image file not found during compilation', iconFile)
            return null
        }

        return this.itemIcons[iconFile]
    }

    getTierIcon(tier: Tier | null): unknown {
        if (tier === null) {
            return null
        }

        const iconFile = TierConfigs[tier].iconPath
        if (!(iconFile in this.tierIcons)) {
            console.warn('Image file not found during compilation', iconFile)
            return null
        }

        return this.tierIcons[iconFile]
    }
}

function getItemIcons(): { [key: string]: unknown } {
    const imgReq = require.context('@img/items', false, /\.(jpe?g|png|gif|svg)$/i)
    const images: { [key: string]: unknown } = {}

    imgReq.keys().map((imageName) => {
        images[imageName.replace('./', '')] = imgReq(imageName)
    })

    return images
}

function getTierIcons(): { [key: string]: unknown } {
    const imgReq = require.context('@img/tiers', false, /\.(jpe?g|png|gif|svg)$/i)
    const images: { [key: string]: unknown } = {}

    imgReq.keys().map((imageName) => {
        images[imageName.replace('./', '')] = imgReq(imageName)
    })

    return images
}
