import { RouteConfig } from 'vue-router'

const routes: Array<RouteConfig> = [
    {
        path: '/',
        component: () => import('@views/layouts/MainLayout.vue'),
        children: [
            {
                path: '',
                component: () => import('@views/pages/AuctionsPage.vue'),
            },
        ],
    },
    {
        name: 'Error404',
        path: '*',
        redirect: '/',
    },
]

export default routes
