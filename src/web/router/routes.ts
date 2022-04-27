import type { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/web/components/HomePage.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: {
            path: '/',
        },
    },
]
