import { Component, Mixins, Vue } from 'vue-property-decorator'

@Component
export class Formatter extends Mixins(Vue) {
    formatNum(val: number): string {
        const fmt = new Intl.NumberFormat(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })

        return fmt.format(val)
    }
}
