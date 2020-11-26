'use strict'

import path from 'path'
import { DefinePlugin } from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'

import { isDev, staticDir, srcDir, srcWebDir, srcCronDir } from './constants'

// ----------------------------------------------------------------------------
// Common
// ----------------------------------------------------------------------------

export default {
    mode: process.env.NODE_ENV,
    devtool: isDev
        ? 'source-map'
        : false,

    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json', 'scss', '.css'],
        alias: {
            // Need to match aliases in tsconfig.json
            '@': staticDir,
            '@common': path.resolve(srcDir, 'common'),

            '@components': path.resolve(srcWebDir, 'components'),
            '@router': path.resolve(srcWebDir, 'router'),
            '@store': path.resolve(srcWebDir, 'store'),
            '@css': path.resolve(srcWebDir, 'assets/css'),
            '@img': path.resolve(srcWebDir, 'assets/img'),
            '@data': path.resolve(srcWebDir, 'assets/data'),

            // https://github.com/vuejs-templates/webpack/issues/215
            vue: isDev
                ? 'vue/dist/vue.js'
                : 'vue/dist/vue.min.js',
        },
        modules: [
            'node_modules',
            srcWebDir,
            srcCronDir,
        ],
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                    },
                }],
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
            {
                test: /\.s(a|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            additionalData: '@import "@css/variables.scss";',
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10 * 1024 * 1024,
                            name: 'imgs/[name]--[folder].[ext]',
                            esModule: false,
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|eot|svg|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader',
            },
        ],
    },

    plugins: [
        new DefinePlugin({
            'DEFINE.AUCTIONS_URL': JSON.stringify('/data'),
            'DEFINE.AUCTIONS_DIR': JSON.stringify(path.resolve(__dirname, '../dist-web/data')),
            'DEFINE.CACHE_DIR': JSON.stringify(path.resolve(srcWebDir, 'assets/data')),
            'DEFINE.IMAGE_DIR': JSON.stringify(path.resolve(srcWebDir, 'assets/img')),
        }),
    ],

    optimization: {
        minimize: !isDev,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    // https://github.com/vuejs/vue-class-component/issues/407
                    keep_classnames: true,
                },
            }),
        ],
    },
}
