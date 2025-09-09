import { createRouter, createWebHistory, type Router } from 'vue-router'
import { routes } from './routes.ts'

// ----------------------------------------------------------------------------
// Router
// ----------------------------------------------------------------------------

export function createAppRouter(): Router {
    return createRouter({
        history: createWebHistory(),
        routes,
    })
}
