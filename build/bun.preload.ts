import { plugin } from 'bun'
import { createPreprocessorPlugin } from './createPreprocessorPlugin'
import { buildConstants } from './BuildConstants'

const preprocessorPlugin = createPreprocessorPlugin({
    defines: buildConstants,
})

await plugin(preprocessorPlugin)
