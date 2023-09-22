// eslint-disable-next-line import/order
import './client/assets/css/main.scss'

import { BrowserTracing } from '@sentry/browser'
import * as Sentry from '@sentry/vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'
import { createApp } from 'vue'
import { SENTRY_DSN } from '@/common/Constants'
import AppLoader from './client/AppLoader.vue'
import { createAppRouter } from './client/router'
import { cleanLocalStorage } from './client/store/Hydration'

async function main() {
    console.info('Release', DEFINE.GIT_HASH)

    // Vue
    const app = createApp(AppLoader)

    // Pinia
    const pinia = createPinia()
    app.use(pinia)

    // Vue Router
    const router = createAppRouter()
    app.use(router)
    await router.isReady()

    // Quasar
    app.use(Quasar, {
        config: {
            dark: true,
        },
    })

    if (!DEFINE.IS_DEV) {
        Sentry.init({
            app,
            dsn: SENTRY_DSN,
            release: DEFINE.GIT_HASH,
            tracesSampleRate: 0.1,
            integrations: [
                new BrowserTracing({
                    routingInstrumentation: Sentry.vueRouterInstrumentation(router),
                }),
            ],
        })
    }

    app.mount('#app')
}

main().catch((err) => {
    console.error(err)
    cleanLocalStorage()
})
