'use strict'

import path from 'path'
import webpack, { DefinePlugin } from 'webpack'
import TerserPlugin from 'terser-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

import { isDev, staticDir, srcDir, srcWebDir } from './webpack.constants'

// ----------------------------------------------------------------------------
// Common
// ----------------------------------------------------------------------------

export const commonConfig: webpack.Configuration = {
    mode: isDev
        ? 'development'
        : 'production',
    devtool: isDev
        ? 'source-map'
        : false,

    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json', '.scss', '.css'],
        alias: {
            // Need to match aliases in tsconfig.json
            '@static': staticDir,
            '@common': path.resolve(srcDir, 'common'),
            '@cron': path.resolve(srcDir, 'cron'),
            '@web': path.resolve(srcDir, 'web'),

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
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            additionalData: (content: string, loaderContext: { resourcePath: string }): string => {
                                return (loaderContext.resourcePath.endsWith('sass'))
                                    ? '@import "@css/variables.scss"\n' + content
                                    : '@import "@css/variables.scss";' + content
                            },
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
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
                            name: 'img/[name].[contenthash].[ext]',
                            esModule: false,
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|eot|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader',
            },
        ],
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: isDev
                ? '[name].css'
                : '[name].[contenthash].css',
            chunkFilename: isDev
                ? '[id].css'
                : '[id].[contenthash].css',
        }),
        new DefinePlugin({
            'DEFINE.IS_DEV': JSON.stringify(isDev),

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
