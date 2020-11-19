/* eslint-disable @typescript-eslint/no-var-requires */

'use strict'

const path = require('path')
const { merge } = require('webpack-merge')
const CommonConfig = require('./webpack.config.common')

// ----------------------------------------------------------------------------
// Cron
// ----------------------------------------------------------------------------

const SRC_DIR = path.resolve(__dirname, '../src/cron')
const DIST_DIR = path.resolve(__dirname, '../dist-cron')

const CronConfig = merge(CommonConfig, {
    target: 'node',

    context: SRC_DIR,
    entry: {
        fetchAuctions: 'fetchAuctions.ts',
        fetchData: 'fetchData.ts',
    },
    output: {
        path: DIST_DIR,
    },

    resolve: {
        modules: [
            SRC_DIR,
        ],
    },
})

module.exports = CronConfig
