import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { QuasarUnusedPlugin } from 'quasar-unused-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import 'webpack-dev-server'
import { merge } from 'webpack-merge'
import { commonConfig } from './webpack.common'
import { srcWebDir, distWebDir, isDev, staticDir } from './BuildConstants'
import { isAnalyze } from './BuildSecret'

// ----------------------------------------------------------------------------
// Web
// ----------------------------------------------------------------------------

export default merge(commonConfig, {
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
                directory: distWebDir,
            },
            {
                directory: '/var/www/wowpay2win/auctions',
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
                                    ? '@use "sass:math"\n @import "@/web/client/assets/css/variables.scss"\n' + content
                                    : '@use "sass:math";  @import "@/web/client/assets/css/variables.scss"; ' + content
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
