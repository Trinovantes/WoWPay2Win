/* eslint-disable @typescript-eslint/no-var-requires */

'use strict'

const path = require('path')
const { merge } = require('webpack-merge')

const CommonConfig = require('./webpack.config.common')
const srcDir = path.resolve(__dirname, '../src/cron')
const distDir = path.resolve(__dirname, '../dist-cron')

// ----------------------------------------------------------------------------
// Cron
// ----------------------------------------------------------------------------

const CronConfig = merge(CommonConfig, {
    target: 'node',

    context: srcDir,
    entry: {
        fetchAuctions: 'fetchAuctions.ts',
        fetchData: 'fetchData.ts',
    },
    output: {
        path: distDir,
    },

    resolve: {
        modules: [
            srcDir,
        ],
    },
})

module.exports = CronConfig
