<template>
    <header id="header" class="row shadow-3">
        <q-toolbar class="col-3 sidebar">
            <q-avatar>
                <img :src="require('@img/token.jpg')">
            </q-avatar>
            <h1 class="title">
                {{ title }}
            </h1>
        </q-toolbar>
        <q-toolbar class="col filters">
            <RegionFilter class="filter region-filter" />
            <TierFilter class="filter" />
        </q-toolbar>
    </header>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import VuexComponent from '@components/base/VuexComponent'

import Constants from '@common/Constants'

@Component({
    components: {
        RegionFilter: () => import('@components/filters/RegionFilter.vue'),
        TierFilter: () => import('@components/filters/TierFilter.vue'),
    },
})
export default class Header extends VuexComponent {
    readonly title = Constants.APP_NAME
}
</script>

<style lang="scss">
header#header{
    background: $header;

    .q-toolbar.sidebar{
        min-width: $sidebar-min-width;
        max-width: $sidebar-max-width;
    }

    .q-toolbar.filters{
        background-color: $bg-side;
    }

    h1.title{
        color: white;
        font-size: 27px;
        font-weight: bold;
        line-height: 40px;
        margin: 0;
        padding: $padding;
    }

    .filter{
        margin: $padding 0;
        margin-left: $padding;
        height: 60px;
        flex: 1;

        &:first-child{
            margin-left: 0;
        }

        &.region-filter{
            max-width: 200px;
        }
    }
}
</style>
