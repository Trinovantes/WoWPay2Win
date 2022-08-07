import { createRouter, createWebHistory, Router } from 'vue-router'
import { routes } from './routes'

// ----------------------------------------------------------------------------
// Router
// ----------------------------------------------------------------------------

export function createAppRouter(): Router {
    return createRouter({
        history: createWebHistory(),
        routes,
    })
}
