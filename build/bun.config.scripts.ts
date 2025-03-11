import Bun from 'bun'
import { buildConstants, distScriptsDir, srcScriptsDir } from './BuildConstants'

const buildResult = await Bun.build({
    entrypoints: [
        `${srcScriptsDir}/fetchAuctions.ts`,
        `${srcScriptsDir}/fetchItems.ts`,
        `${srcScriptsDir}/fetchSocketIds.ts`,
    ],

    outdir: distScriptsDir,
    define: buildConstants,

    packages: 'bundle',
    external: [
        'bun',
        'node:*',
        '@sentry/node',
    ],
})

if (!buildResult.success) {
    console.warn(buildResult)
    process.exit(1)
}
