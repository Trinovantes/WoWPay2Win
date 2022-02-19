<script lang="ts">
import { defineComponent, ref } from 'vue'
import { sample } from 'lodash'

export default defineComponent({
    setup() {
        const DAYS_OF_WEEK = 7
        const daysSinceTues = (DAYS_OF_WEEK + (new Date().getDay() - 2)) % DAYS_OF_WEEK
        const nonClassicExpansions = ['WotLK', 'Cataclysm', 'MoP', 'WoD', 'Legion'] // We don't talk about BfA here

        const memes = [
            'If you still use WoWProgress for recruitment, check out this <a href="https://github.com/Trinovantes/userscript-wowprogress-character-page" rel="noopener">browser extension</a> I\'ve made',
            ...nonClassicExpansions.map((expac) => `${expac} Classic waiting room`),
            'Does anybody else think we should delete pandas from the game?',
            'Sometimes I wonder how much money I would make if I had put ads on this site',
            'Imagine if I got a commission everytime somebody made a purchase because of this site',
            'Isn\'t this just pay2win with extra steps?',
            'I bet there are still realms that have Realm First Kil\'Jaeden available',
            'I\'m calling the overtime police',
            'Anyone caught playing Classic will be gkicked',
            'Please buff BDK',
            'Sponsored by Raid: Shadow Lands',
            'Friendship with WoW ended; Runescape is my new best friend',
            `${daysSinceTues} ${daysSinceTues === 1 ? 'day' : 'days'} since last wipe on Shriekwing`,
        ]

        const flavorText = ref(sample(memes))

        return {
            flavorText,
        }
    },
})
</script>

<template>
    <footer id="footer">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="flavor-text" v-html="flavorText" />

        <p class="links">
            <a href="https://github.com/Trinovantes/WoWPay2Win">GitHub</a>
        </p>
    </footer>
</template>

<style lang="scss">
footer#footer{
    font-size: 0.75rem;
    padding: 0 $side-padding;

    p{
        margin: $padding 0;

        &:first-child{
            margin-top: $side-padding;
        }
        &:last-child{
            margin-bottom: $side-padding;
        }

        &.flavor-text{
            font-style: italic;
        }

        &.links{
            a{
                margin-right: $padding;
            }
        }
    }
}
</style>
