import type { Tier, TierConfig } from '../Boe'

const config: TierConfig = {
    name: 'Dragonflight Profession Recipes',
    slug: 'dragonflight-professions' as Tier,
    iconName: '0-dragonflight.png',
    boes: [
        {
            label: 'Jewelcrafting',
            ids: [
                194640,
                194641,
                194642,
            ],
        },
        {
            label: 'Blacksmithing',
            ids: [
                205145,
                205144,

                194484,
                194485,
                194492,
                194491,
                194490,
                194489,
                194486,

                194483,
                194476,
                194481,
            ],
        },
        {
            label: 'Leatherworking',
            ids: [
                204968,

                193880,
                193881,
                193882,
                193883,

                193873,
                193872,
                193868,
                193869,
            ],
        },
        {
            label: 'Tailoring',
            ids: [
                205140,
                194255,
                194260,
                194259,
                194256,
            ],
        },
        {
            label: 'Inscription',
            ids: [
                198876,
            ],
        },
        {
            label: 'Alchemy',
            ids: [
                204696,
                204695,
                201740,
                191544,
                191597,
            ],
        },
        {
            label: 'Enchanting',
            ids: [
                204975,
            ],
        },
        {
            label: 'Engineering',
            ids: [
                199227,
                205036,
            ],
        },
    ],
}

export default config
