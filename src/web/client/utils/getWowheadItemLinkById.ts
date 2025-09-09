import type { RegionSlug } from '../../../common/RegionConfig.ts'

export function getWowheadItemLinkById(itemId: number, region: RegionSlug): string {
    let domain: string
    switch (region) {
        case 'kr':
            domain = 'ko'
            break

        default:
            domain = 'www'
    }

    return `https://${domain}.wowhead.com/item=${itemId}`
}
