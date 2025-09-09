import 'webpack-dev-server'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { QuasarUnusedPlugin } from 'quasar-unused-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import merge from 'webpack-merge'
import { srcWebDir, distWebDir, isDev, staticDir } from './BuildConstants.ts'
import { isAnalyze } from './BuildSecret.ts'
import { AUCTIONS_DATA_DIR } from '../src/common/Constants.ts'
import { commonConfig } from './webpack.common.ts'

// ----------------------------------------------------------------------------
// Web
// ----------------------------------------------------------------------------

export default merge.default(commonConfig, {
    target: 'web',

    entry: {
        main: `${srcWebDir}/main.ts`,
    },

    output: {
        path: distWebDir,
        publicPath: '/',
        filename: isDev
            ? '[name].js'
            : '[name].[contenthash].js',
    },

    devServer: {
        historyApiFallback: true,
        static: [
            {
                directory: AUCTIONS_DATA_DIR,
                publicPath: '/data',
            },
        ],
    },

    module: {
        rules: [
            {
                test: /\.(sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            additionalData: (content: string, loaderContext: { resourcePath: string }): string => {
                                return (loaderContext.resourcePath.endsWith('sass'))
                                    ? '@use "sass:color"\n@use "sass:math"\n@use "@css/variables.scss" as *\n' + content
                                    : '@use "sass:color"; @use "sass:math"; @use "@css/variables.scss" as *; ' + content
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|eot|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                type: 'asset',
            },
            {
                test: /\.(jpe?g|png|gif|svg|webp)$/i,
                type: 'asset/inline',
            },
        ],
    },

    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: isAnalyze()
                ? 'server'
                : 'disabled',
        }),
        new QuasarUnusedPlugin({
            enableSsr: false,
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: staticDir,
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: isDev
                ? '[name].css'
                : '[name].[contenthash].css',
        }),
        new HtmlWebpackPlugin({
            template: `${srcWebDir}/index.html`,
        }),
    ],
})
