<template>
    <footer id="footer" class="group">
        <p class="meme">
            {{ meme }}
        </p>
        <p>
            <a href="https://github.com/Trinovantes/WoWPay2Win">GitHub</a>
            <a href="https://www.patreon.com/user?u=10301737">Patreon</a>
        </p>
    </footer>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'

import { sample } from 'lodash'

import Constants from '@common/Constants'

@Component
export default class Footer extends Vue {
    readonly title = Constants.APP_NAME
    readonly year = new Date().getUTCFullYear()

    get meme(): string {
        const memes = [
            'Does anybody else think we should delete pandas from the game? You should never trust pandas, horrible creatures!',
            'Sometimes I wonder how much money I\'d make if I\'d put ads on this site',
            'Would you believe that this site only costs me $15 per year to run?',
            'Pull the cord, but not too hard so I still feel safe',
            'Isn\'t this just pay2win with extra steps?',
            'I bet there are still realms that have Realm First Kil\'Jaeden available',
        ]

        return sample(memes) || ''
    }
}
</script>

<style lang="scss">
footer#footer{
    font-size: 13px;
    line-height: 1.5em;

    p{
        margin: $padding 0;

        &:first-child{
            margin-top: $side-padding;
        }
        &:last-child{
            margin-bottom: $side-padding;
        }

        &.meme{
            font-style: italic;
        }
    }

    a{
        margin-right: $padding;
    }
}
</style>
