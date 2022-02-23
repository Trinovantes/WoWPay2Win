<script lang="ts">
import { defineComponent } from 'vue'
import { useLiveAuctions } from '../store/Auctions/useLiveAuctions'
import { useFilterSyncLocalStorage } from '../store/Filter/useFilterSyncLocalStorage'
import { useFilterSyncQuery } from '../store/Filter/useFilterSyncQuery'

export default defineComponent({
    setup() {
        useFilterSyncLocalStorage()
        useFilterSyncQuery()
        useLiveAuctions()
    },
})
</script>

<template>
    <router-view v-slot="{ Component }">
        <template v-if="Component">
            <suspense>
                <component :is="Component" />
            </suspense>
        </template>
    </router-view>
</template>
