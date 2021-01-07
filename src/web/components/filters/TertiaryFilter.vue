<template>
    <div class="group">
        <h2>Tertiaries</h2>
        <q-list dense>
            <q-item
                v-for="tertiary of tertiaryOptions"
                :key="tertiary.value"
                v-ripple
                tag="label"
            >
                <q-item-section avatar>
                    <q-checkbox
                        v-model="selectedTeriary"
                        :val="tertiary.value"
                    />
                </q-item-section>
                <q-item-section>
                    <q-item-label>
                        {{ tertiary.label }}
                    </q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import VuexComponent from '@components/base/VuexComponent'

import { Tertiary } from '@common/Constants'

@Component
export default class TertiaryFilter extends VuexComponent {
    readonly tertiaryOptions: Array<{ label: string; value: number }> = []

    constructor() {
        super()

        for (const [tertiaryKey, tertiaryLabel] of Object.entries(Tertiary)) {
            const bonusId = Number(tertiaryKey)
            if (isNaN(bonusId)) {
                continue
            }

            this.tertiaryOptions.push({
                label: tertiaryLabel as string,
                value: bonusId,
            })
        }
    }

    get selectedTeriary(): Array<Tertiary> {
        return [...this.tertiaries.values()]
    }

    set selectedTeriary(tertiaries: Array<Tertiary>) {
        this.changeTertiaries(new Set(tertiaries))
    }
}
</script>
