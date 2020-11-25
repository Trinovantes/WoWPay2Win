/* eslint-disable @typescript-eslint/no-var-requires */

'use strict'

const path = require('path')
const { merge } = require('webpack-merge')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const CommonConfig = require('./webpack.config.common')
const isDev = (process.env.NODE_ENV === 'development')
const srcDir = path.resolve(__dirname, '../src/web')
const distDir = path.resolve(__dirname, '../dist-web')
const staticDir = path.resolve(__dirname, '../static')

// ----------------------------------------------------------------------------
// Web
// ----------------------------------------------------------------------------

const WebConfig = merge(CommonConfig, {
    target: 'web',

    context: srcDir,
    entry: {
        main: 'main.ts',
    },
    output: {
        path: distDir,
        filename: isDev
            ? '[name].js'
            : '[name].[contenthash].js',
    },

    resolve: {
        modules: [
            srcDir,
        ],
    },

    devServer: {
        contentBase: [staticDir, distDir],
    },

    plugins: [
        !isDev && new CopyWebpackPlugin({
            patterns: [
                {
                    from: staticDir,
                },
            ],
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
        }),
        new HtmlWebpackPlugin({
            template: '404.html',
            filename: '404.html',
        }),
    ].filter(Boolean),
})

module.exports = WebConfig
