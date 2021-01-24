import Vue, { ComponentOptions, CreateElement } from 'vue'

// ----------------------------------------------------------------------------
// Quasar
// ----------------------------------------------------------------------------

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'quasar/src/css/index.sass'
import Quasar from 'quasar'

Vue.use(Quasar, {
    config: {
        dark: true,
    },
})

// ----------------------------------------------------------------------------
// App
// ----------------------------------------------------------------------------

import '@css/main.scss'
import App from '@views/App.vue'
import AppRouter from '@router/AppRouter'
import AppStore from '@store/AppStore'

const appOptions: ComponentOptions<Vue> = {
    router: AppRouter,
    store: AppStore,
    render: (createElement: CreateElement) => {
        return createElement(App)
    },
}

const app = new Vue(appOptions)
AppRouter.onReady(() => {
    app.$mount('#app', true)
})
