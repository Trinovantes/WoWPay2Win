import Vue from 'vue'

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
import App from '@components/App.vue'
import AppRouter from '@router/AppRouter'
import AppStore from '@store/AppStore'

const app = new App({
    router: AppRouter,
    store: AppStore,
})

app.$mount('#app')
