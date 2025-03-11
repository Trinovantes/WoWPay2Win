import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('../components/HomePage.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: {
            path: '/',
        },
    },
]
