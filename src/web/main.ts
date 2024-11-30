import './client/assets/css/main.scss'
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
            release: DEFINE.GIT_HASH,
            dsn: SENTRY_DSN,
            integrations: [
                Sentry.browserTracingIntegration({ router }),
            ],
            tracesSampleRate: 0,
            profilesSampleRate: 0,
        })
    }

    app.mount('#app')
}

main().catch((err: unknown) => {
    console.error(err)
    cleanLocalStorage()
})
