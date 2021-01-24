import { merge } from 'webpack-merge'
import { VueLoaderPlugin } from 'vue-loader'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { WebpackPluginInstance } from 'webpack'

import { commonConfig } from './webpack.config.common'
import { isDev, staticDir, srcWebDir, distWebDir } from './webpack.constants'

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
        contentBase: [
            staticDir, // Static assets
            distWebDir, // Auctions data files
        ],
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
            template: `${srcWebDir}/index.html`,
        }),
    ].filter(Boolean) as Array<WebpackPluginInstance>,
})
