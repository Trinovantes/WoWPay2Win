<template>
    <header id="header" class="row shadow-3">
        <q-toolbar class="col-3 sidebar">
            <q-avatar
                size="40px"
            >
                <img src="@static/token.jpg" :alt="title" width="40" height="40">
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
import { Component, Mixins } from 'vue-property-decorator'
import { VuexAccessor } from '@views/mixins/VuexAccessor'

import Constants from '@common/Constants'

@Component({
    components: {
        RegionFilter: () => import('@views/filters/RegionFilter.vue'),
        TierFilter: () => import('@views/filters/TierFilter.vue'),
    },
})
export default class Header extends Mixins(VuexAccessor) {
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
        line-height: 1;
        margin: 0;
        padding: 0 $padding;
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
