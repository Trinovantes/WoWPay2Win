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

const isDev = (process.env.NODE_ENV === 'development')

const WebConfig = merge(CommonConfig, {
    target: 'web',

    context: SRC_DIR,
    entry: {
        main: 'main.ts',
    },
    output: {
        path: DIST_DIR,
        filename: isDev
            ? '[name].js'
            : '[name].[contenthash].js',
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
        new HtmlWebpackPlugin({
            template: '404.html',
            filename: '404.html',
        }),
    ],
})

module.exports = WebConfig
