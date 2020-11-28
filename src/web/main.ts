import Vue from 'vue'

// ----------------------------------------------------------------------------
// Quasar
// ----------------------------------------------------------------------------

import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'quasar/dist/quasar.min.css'
import Quasar from 'quasar'

Vue.use(Quasar, {
    config: {
        dark: true,
        brand: {
            primary: '#297acc',
            secondary: '#41a4fa',
            accent: '#9C27B0',
            dark: '#222',

            positive: '#2e8743',
            negative: '#C10015',
            info: '#31CCEC',
            warning: '#F2C037',
        },
    },
})

// ----------------------------------------------------------------------------
// App
// ----------------------------------------------------------------------------

import '@css/main.scss'
import App from '@components/App.vue'
import AppRouter from '@router/AppRouter'
import AppStore from '@store/AppStore'
import Constants from '@common/Constants'

const app = new App({
    router: AppRouter,
    store: AppStore,
})

try {
    app.$mount('#app')
} catch (err) {
    const error = err as Error
    console.error(error.message)
    if (Constants.IS_DEV) {
        console.error(error.stack)
    }
}
