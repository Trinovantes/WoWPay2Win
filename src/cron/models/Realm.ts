import type { RealmData } from '@/common/Data'
import type { Region } from '@/cron/models/Region'

// ----------------------------------------------------------------------------
// Realm
// ----------------------------------------------------------------------------

export class Realm {
    readonly id: number
    readonly name: string

    constructor(region: Region, id: number, name: string) {
        this.id = id
        this.name = name
    }

    export(): RealmData {
        return {
            id: this.id,
            name: this.name,
        }
    }
}
