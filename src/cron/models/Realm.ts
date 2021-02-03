import { IRealmCache } from '@common/ICache'
import { Region } from '@cron/models/Region'

export class Realm {
    readonly id: number
    readonly name: string

    constructor(region: Region, id: number, name: string) {
        this.id = id
        this.name = name
    }

    export(): IRealmCache {
        return {
            id: this.id,
            name: this.name,
        }
    }
}
