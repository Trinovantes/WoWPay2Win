<template>
    <router-view v-slot="{ Component }">
        <template v-if="Component">
            <suspense>
                <component :is="Component" />
            </suspense>
        </template>
    </router-view>
</template>
