'use strict'

const { merge } = require('webpack-merge')
const CommonConfig = require('./webpack.config.common')
const path = require('path')

const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// ----------------------------------------------------------------------------
// Web
// ----------------------------------------------------------------------------

const SRC_DIR = path.resolve(__dirname, '../src/web')
const DIST_DIR = path.resolve(__dirname, '../dist-web')

const WebConfig = merge(CommonConfig, {
    target: 'web',

    context: SRC_DIR,
    entry: {
        main: 'main.ts',
    },
    output: {
        path: DIST_DIR,
    },

    resolve: {
        modules: [
            SRC_DIR,
        ],
    },

    devServer: {
        contentBase: DIST_DIR,
    },

    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
            favicon: 'assets/img/favicon.ico',
        }),
    ],
})

module.exports = WebConfig
