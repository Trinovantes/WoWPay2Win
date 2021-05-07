import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/web/layouts/MainLayout.vue'),
        children: [
            {
                name: 'home',
                path: '',
                component: () => import('@/web/pages/AuctionsPage.vue'),
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'Error404',
        redirect: {
            name: 'home',
        },
    },
]
