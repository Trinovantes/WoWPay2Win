'use strict'

const path = require('path')
const webpack = require('webpack')

// ----------------------------------------------------------------------------
// Common
// ----------------------------------------------------------------------------

const CommonConfig = {
    mode: process.env.NODE_ENV,
    devtool: (process.env.NODE_ENV === 'development')
        ? 'source-map'
        : false,

    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json', 'scss', '.css'],
        alias: {
            // Need to match aliases in tsconfig.json
            '@common': path.resolve(__dirname, '../src/common'),

            '@components': path.resolve(__dirname, '../src/web/components'),
            '@router': path.resolve(__dirname, '../src/web/router'),
            '@store': path.resolve(__dirname, '../src/web/store'),

            '@img': path.resolve(__dirname, '../src/web/assets/img'),
            '@css': path.resolve(__dirname, '../src/web/assets/css'),
            '@data': path.resolve(__dirname, '../src/web/assets/data'),

            // https://github.com/vuejs-templates/webpack/issues/215
            vue: 'vue/dist/vue.js',
        },
        modules: [
            'node_modules',
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
        new webpack.DefinePlugin({
            'process.env.DATA_URL': JSON.stringify('/data'),
            'process.env.DATA_DIR': JSON.stringify(path.resolve(__dirname, '../dist-web/data')),
            'process.env.CACHE_DIR': JSON.stringify(path.resolve(__dirname, '../src/web/assets/data')),
            'process.env.IMAGE_DIR': JSON.stringify(path.resolve(__dirname, '../src/web/assets/img')),
        }),
    ],
}

module.exports = CommonConfig
