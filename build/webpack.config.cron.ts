import { merge } from 'webpack-merge'
import { commonConfig } from './webpack.common'
import { srcCronDir, distCronDir } from './BuildConstants'

// ----------------------------------------------------------------------------
// Cron
// ----------------------------------------------------------------------------

export default merge(commonConfig, {
    target: 'node',

    entry: {
        fetchAuctions: `${srcCronDir}/fetchAuctions.ts`,
        fetchItems: `${srcCronDir}/fetchItems.ts`,
    },

    output: {
        path: distCronDir,
    },

    externals: {
        '@sentry/node': 'commonjs @sentry/node',
    },
})
