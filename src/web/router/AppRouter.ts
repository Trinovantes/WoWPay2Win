import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// ----------------------------------------------------------------------------
// Router
// ----------------------------------------------------------------------------

const AppRouter = new VueRouter({
    routes: [
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
    ],
})

export default AppRouter
