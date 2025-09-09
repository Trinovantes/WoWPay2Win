import { buildConstants } from './BuildConstants.ts'

function defineGlobals() {
    for (const [key, value] of Object.entries(buildConstants)) {
        Object.defineProperty(global, key, {
            value: eval(value),
            writable: false,
            configurable: false,
            enumerable: true,
        })
    }
}

defineGlobals()
