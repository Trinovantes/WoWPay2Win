<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const DAYS_OF_WEEK = 7
const daysSinceTues = (DAYS_OF_WEEK + (new Date().getDay() - 2)) % DAYS_OF_WEEK
const nonClassicExpansions = ['Cataclysm', 'MoP', 'WoD', 'Legion', 'BfA', 'Shadowlands']
const memes = [
    ...nonClassicExpansions.map((expac) => `${expac} Classic waiting room`),
    'We are trying to reach you about your mount\'s extended warranty.',
    'Does anybody else think we should delete pandas from the game?',
    'Sometimes I wonder how much money I would make if I had put ads on this site',
    'Isn\'t this just pay2win with extra steps?',
    'I bet there are still realms that have Realm First Kil\'Jaeden available',
    'I\'m calling the overtime police',
    'Anyone caught playing Classic will be gkicked',
    'Please buff BDK',
    'Sponsored by Raid: Shadow Lands',
    `${daysSinceTues} ${daysSinceTues === 1 ? 'day' : 'days'} since last wipe on Shriekwing`,
    `${daysSinceTues} ${daysSinceTues === 1 ? 'day' : 'days'} since last wipe on Zskarn`,
    'Next expansion will be different',
    'A triumphant roar echoes from atop the Seat of the Aspects as Nasz\'uro, the Unbound Legacy, is formed.',
    'A twiumphant woaw echoes fwom atop the Seat of the Aspects as Nyasz\'uwu, the Unbound Wegacy is fowmed >:3',
    'Remember: exploit early, exploit often',
    'Huffs Copium',
]

const flavorText = ref<string | undefined>('')
onMounted(() => {
    flavorText.value = memes[Math.floor(Math.random() * memes.length)]
})
</script>

<template>
    <footer>
        <p class="flavor-text" v-text="flavorText" />

        <p class="links">
            <a href="https://github.com/Trinovantes/WoWPay2Win">GitHub</a>
        </p>
    </footer>
</template>

<style lang="scss" scoped>
footer{
    font-size: 0.75rem;
    padding: $side-padding;
    display: grid;
    gap: $padding;

    p{
        margin: 0;

        &.flavor-text{
            font-style: italic;
        }

        &.links{
            display: flex;
            gap: $padding;
        }
    }
}
</style>
