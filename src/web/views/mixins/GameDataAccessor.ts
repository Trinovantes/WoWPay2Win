import { Component, Watch } from 'vue-property-decorator'
import { VuexAccessor } from '@views/mixins/VuexAccessor'

import { IItemAuctionCache, IItemCache, IRealmCache, IRegionCache } from '@common/ICache'
import { getRegionLocale, RegionSlug } from '@common/Constants'

@Component
export class GameDataAccessor extends VuexAccessor {
    private readonly dataFiles = getDataFiles()
    protected regionRealms: Array<IRealmCache> = []
    protected realmToConnectedRealmMap: { [key: number]: number } = {}

    created(): void {
        this.fetchRealms()
    }

    @Watch('region')
    fetchRealms(): void {
        this.regionRealms = []
        this.realmToConnectedRealmMap = {}

        if (!this.region) {
            return
        }

        const regionFile = `region-${this.region}.json`
        if (!(regionFile in this.dataFiles)) {
            console.warn('Region data file not found during compilation', regionFile)
            return
        }

        const regionCache: IRegionCache = this.dataFiles[regionFile] as IRegionCache
        for (const connectedRealm of regionCache.connectedRealms) {
            for (const realm of connectedRealm.realms) {
                this.regionRealms.push(realm)
                this.realmToConnectedRealmMap[realm.id] = connectedRealm.id
            }
        }

        this.regionRealms = this.regionRealms.sort((a, b) => {
            return a.name.localeCompare(b.name)
        })
    }

    getBaseIlvl(itemId: number): number {
        const itemFile = `item-${itemId}.json`
        if (!(itemFile in this.dataFiles)) {
            console.warn('Item data file not found during compilation', itemFile)
            return NaN
        }

        const itemCache = this.dataFiles[itemFile] as IItemCache
        return itemCache.baseLevel
    }

    getItemName(itemId: number): string {
        if (!this.region) {
            return ''
        }

        const itemFile = `item-${itemId}.json`
        if (!(itemFile in this.dataFiles)) {
            console.warn('Item data file not found during compilation', itemFile)
            return `Item ${itemId}`
        }

        const itemCache = this.dataFiles[itemFile] as IItemCache
        const locale = getRegionLocale(this.region)
        return itemCache.localizedName[locale] || ''
    }

    getWowheadItemLink(item: IItemAuctionCache, region: RegionSlug): string {
        const domain = getWowheadDomain(region)
        return `https://${domain}.wowhead.com/item=${item.itemId}&bonus=${item.bonuses.join(':')}`
    }

    getWowheadItemLinkById(itemId: number, region: RegionSlug): string {
        const domain = getWowheadDomain(region)
        return `https://${domain}.wowhead.com/item=${itemId}`
    }

    getConnectedRealmName(crId: number): string {
        if (!this.region) {
            return ''
        }

        const regionFile = `region-${this.region}.json`
        if (!(regionFile in this.dataFiles)) {
            console.warn('Region data file not found during compilation', regionFile)
            return ''
        }

        const regionCache = this.dataFiles[regionFile] as IRegionCache
        for (const connectedRealmCache of regionCache.connectedRealms) {
            if (connectedRealmCache.id === crId) {
                return connectedRealmCache.realms.map((realmCache) => realmCache.name).join(', ')
            }
        }

        return ''
    }
}

function getDataFiles(): { [key: string]: unknown } {
    const req = require.context('@data', false, /\.(json)$/)
    const files: { [key: string]: unknown } = {}

    req.keys().map((fileName) => {
        files[fileName.replace('./', '')] = req(fileName)
    })

    return files
}

function getWowheadDomain(region: RegionSlug): string {
    switch (region) {
        case RegionSlug.KR:
            return 'ko'
        default:
            return 'www'
    }
}
