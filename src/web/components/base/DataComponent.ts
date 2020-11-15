import VuexComponent from './VuexComponent'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'

import { IItemAuctionCache, IItemCache, IRealmCache, IRegionCache } from '@common/ICache'
import { getRegionLocale } from '@common/Constants'

@Component
export default class DataComponent extends VuexComponent {
    readonly dataFiles = getDataFiles()
    protected realms: Array<IRealmCache> = []
    protected realmToConnectedRealmMap: { [key: number]: number } = {}

    created(): void {
        this.fetchRealms()
    }

    @Watch('region')
    fetchRealms(): void {
        this.realms = []
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
                this.realms.push(realm)
                this.realmToConnectedRealmMap[realm.id] = connectedRealm.id
            }
        }

        this.realms = this.realms.sort((a, b) => {
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
            return ''
        }

        const itemCache = this.dataFiles[itemFile] as IItemCache
        const locale = getRegionLocale(this.region)
        return itemCache.localizedName[locale] || ''
    }

    getWowheadItemLink(item: IItemAuctionCache): string {
        return `https://www.wowhead.com/item=${item.itemId}&bonus=${item.bonuses.join(':')}`
    }

    getWowheadItemLinkById(itemId: number): string {
        return `https://www.wowhead.com/item=${itemId}`
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

export function getDataFiles(): { [key: string]: unknown } {
    const req = require.context('@data', false, /\.(json)$/)
    const files: { [key: string]: unknown } = {}

    req.keys().map((fileName) => {
        files[fileName.replace('./', '')] = req(fileName)
    })

    return files
}
