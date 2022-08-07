// eslint-disable-next-line import/order
import '@/common/utils/setupDayjs'

// eslint-disable-next-line import/order
import './client/assets/css/main.scss'

import { Integrations } from '@sentry/tracing'
import * as Sentry from '@sentry/vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar/src/index.all'
import { createApp } from 'vue'
import { SENTRY_DSN } from '@/common/Constants'
import AppLoader from './client/AppLoader.vue'
import { createAppRouter } from './client/router'
import { cleanLocalStorage } from './client/store/Hydration'

async function main() {
    // Vue
    const app = createApp(AppLoader)

    // Vue Router
    const router = createAppRouter()
    app.use(router)
    await router.isReady()

    // Pinia
    const pinia = createPinia()
    app.use(pinia)

    // Quasar
    app.use(Quasar, {
        config: {
            dark: true,
        },
    })

    if (!DEFINE.IS_DEV) {
        // Sentry
        Sentry.init({
            app,
            dsn: SENTRY_DSN,
            release: DEFINE.GIT_HASH,
            integrations: [
                new Integrations.BrowserTracing({
                    routingInstrumentation: Sentry.vueRouterInstrumentation(router),
                }),
            ],
            tracesSampleRate: 0,
            enabled: !DEFINE.IS_DEV,
        })
    }

    app.mount('#app')
}

function onError(err: unknown) {
    console.warn(err)
    cleanLocalStorage()
}

window.addEventListener('error', onError)
window.addEventListener('unhandledrejection', onError)
void main()
