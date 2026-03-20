import type { ItemId } from '../api/BnetResponse.ts'
import type { RegionSlug } from '../RegionConfig.ts'

export function getWowheadItemLinkById(itemId: ItemId, region: RegionSlug): string {
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
