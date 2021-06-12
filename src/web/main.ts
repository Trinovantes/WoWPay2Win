import './assets/css/main.scss'
import { createApp } from 'vue'
import { createAppRouter } from './router'
import { createFilterStore, filterInjectionKey } from './store/Filter'
import { auctionsInjectionKey, createAuctionsStore } from './store/Auctions'
import AppLoader from './components/AppLoader.vue'
import { Quasar } from 'quasar'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { SENTRY_DSN } from '@/common/Constants'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
        new Integrations.BrowserTracing(),
    ],
    tracesSampleRate: 1.0,
    enabled: !DEFINE.IS_DEV,
})

async function main() {
    // Vue
    const app = createApp(AppLoader)

    // Vue Router
    const router = createAppRouter()
    app.use(router)
    await router.isReady()

    // Vuex
    const filterStore = await createFilterStore(router)
    app.use(filterStore, filterInjectionKey)

    const auctionsStore = await createAuctionsStore(filterStore)
    app.use(auctionsStore, auctionsInjectionKey)

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
})
