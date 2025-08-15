import { BnetAuctionsResponse } from '@/scripts/api/BnetResponse'
import { ITEM_MODIFIER_KEY } from '../ItemModifier'

type ItemModifier = Required<Required<BnetAuctionsResponse>['auctions'][number]['item']>['modifiers'][number]

export function filterItemModifiers(modifiers?: Array<ItemModifier>) {
    const filteredModifiers = modifiers
        ?.filter((modifier) => (
            modifier.type === ITEM_MODIFIER_KEY.CHANGE_MODIFIED_CRAFTING_STAT_1 ||
            modifier.type === ITEM_MODIFIER_KEY.CHANGE_MODIFIED_CRAFTING_STAT_2
        ))

    return !filteredModifiers || filteredModifiers.length === 0
        ? undefined
        : filteredModifiers
}
