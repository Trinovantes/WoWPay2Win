import Component from 'vue-class-component'
import Vue from 'vue'
import { mapMutations, mapState } from 'vuex'

import { Region, Tertiary, Tier } from '@common/Constants'
import { IIlvlRange } from '@store/AppStore'

@Component({
    computed: {
        ...mapState([
            'region',
            'realm',
            'lastModified',

            'tier',

            'boes',
            'ilvlRange',
            'maxBuyout',
            'mustHaveSocket',
            'tertiaries',
        ]),
    },
    methods: {
        ...mapMutations([
            'changeRegion',
            'changeRealm',
            'changeLastModified',

            'changeTier',

            'changeBoes',
            'changeIlvlRange',
            'changeMaxBuyout',
            'changeMustHaveSocket',
            'changeTertiaries',
        ]),
    },
})
export default class VuexComponent extends Vue {
    region!: Region | null
    changeRegion!: (region: Region | null) => void
    realm!: number | null
    changeRealm!: (realm: number | null) => void
    lastModified!: number | null
    changeLastModified!: (lastModified: number | null) => void

    tier!: Tier | null
    changeTier!: (tier: Tier | null) => void

    boes!: Set<number>
    changeBoes!: (boes: Set<number>) => void
    ilvlRange!: IIlvlRange
    changeIlvlRange!: (ilvlRange: IIlvlRange) => void
    maxBuyout!: number
    changeMaxBuyout!: (maxBuyout: number) => void
    mustHaveSocket!: boolean
    changeMustHaveSocket!: (mustHaveSocket: boolean) => void
    tertiaries!: Set<Tertiary>
    changeTertiaries!: (tertiaries: Set<Tertiary>) => void
}
