import './assets/css/main.scss'
import { createApp } from 'vue'
import { createAppRouter } from './router'
import AppLoader from './components/AppLoader.vue'
import { Quasar } from 'quasar/src/index.all'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { SENTRY_DSN } from '@/common/Constants'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import { createPinia } from 'pinia'
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
