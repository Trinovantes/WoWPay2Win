<script lang="ts">
import { defineComponent } from 'vue'
import { useLiveAuctions } from '../store/Auctions/useLiveAuctions'
import { useSyncFilterLocalStorage } from '../store/Filter/useSyncFilterLocalStorage'
import { useSyncFilterQuery } from '../store/Filter/useSyncFilterQuery'

export default defineComponent({
    setup() {
        useLiveAuctions()
        useSyncFilterLocalStorage()
        useSyncFilterQuery()
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
