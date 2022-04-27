
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar/src/index.all'
import { createApp } from 'vue'
import { SENTRY_DSN } from '@/common/Constants'
import './assets/css/main.scss'
import AppLoader from './components/AppLoader.vue'
import { createAppRouter } from './router'
import { cleanLocalStorage } from './store/Hydration'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

Sentry.init({
    dsn: SENTRY_DSN,
    release: DEFINE.GIT_HASH,
    integrations: [
        new Integrations.BrowserTracing(),
    ],
    tracesSampleRate: 0,
    enabled: !DEFINE.IS_DEV,
})

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

    app.mount('#app')
}

main().catch((err) => {
    console.warn(err)
    Sentry.captureException(err)
    cleanLocalStorage()
})
