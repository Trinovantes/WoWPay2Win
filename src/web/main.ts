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

try {
    app.$mount('#app')
} catch (err) {
    const error = err as Error
    console.error(error.message)
    if (DEFINE.IS_DEV) {
        console.error(error.stack)
    }
}
