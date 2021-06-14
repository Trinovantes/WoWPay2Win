import { merge } from 'webpack-merge'
import { commonConfig, srcCronDir, distCronDir } from './webpack.common'

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
})
