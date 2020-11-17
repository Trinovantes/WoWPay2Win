import { RouteConfig } from 'vue-router'

import MainLayout from '@components/MainLayout.vue'
import Auctions from '@components/Auctions.vue'

const routes: Array<RouteConfig> = [
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: '',
                component: Auctions,
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
