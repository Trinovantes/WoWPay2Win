import { merge } from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import { commonConfig, isDev, staticDir, srcWebDir, distWebDir } from './webpack.config.common'

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
        chunkFilename: isDev
            ? '[name].js'
            : '[name].[contenthash].js',
    },

    devServer: {
        historyApiFallback: true,
        contentBase: [
            distWebDir,
        ],
    },

    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: staticDir,
                },
            ],
        }),
        new HtmlWebpackPlugin({
            template: `${srcWebDir}/index.html`,
        }),
    ],
})
