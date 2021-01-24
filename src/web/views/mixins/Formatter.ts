import Component from 'vue-class-component'
import Vue from 'vue'

@Component
export class Formatter extends Vue {
    formatNum(val: number): string {
        const fmt = new Intl.NumberFormat(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })

        return fmt.format(val)
    }
}
