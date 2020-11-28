import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import routes from './routes'

// ----------------------------------------------------------------------------
// Router
// ----------------------------------------------------------------------------

const AppRouter = new VueRouter({
    routes,
})

export default AppRouter
