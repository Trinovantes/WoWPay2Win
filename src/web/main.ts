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

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

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
    const error = err as Error
    console.warn(error)
})
