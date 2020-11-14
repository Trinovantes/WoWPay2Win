import Vue from 'vue'
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
        component: Vue.component('Error404', {
            render(createElement) {
                return createElement('p', `${window.location.href} not found`)
            },
        }),
    },
]

export default routes
