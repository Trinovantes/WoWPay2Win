import { RouteRecordRaw } from 'vue-router'

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: () => import('@/web/layouts/MainLayout.vue'),
        children: [
            {
                path: '',
                component: () => import('@/web/pages/AuctionsPage.vue'),
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: {
            path: '/',
        },
    },
]
