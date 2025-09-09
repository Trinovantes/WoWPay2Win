import path from 'node:path'
import vueLoader from 'vue-loader'
import webpack, { type Configuration } from 'webpack'
import { isDev, buildConstants, srcWebDir, srcDir } from './BuildConstants.ts'

export const commonConfig: Configuration = {
    mode: isDev
        ? 'development'
        : 'production',
    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json', 'scss', '.css'],
        alias: {
            '@css': path.resolve(srcWebDir, 'client', 'assets', 'css'),
            '@components': path.resolve(srcWebDir, 'client', 'components'),
            '@Constants': path.resolve(srcDir, 'common', 'Constants.ts'),
        },
    },

    plugins: [
        new webpack.DefinePlugin(buildConstants),
        new vueLoader.VueLoaderPlugin(),
    ],

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'esbuild-loader',
                    options: {
                        loader: 'ts',
                    },
                }],
            },
            {
                test: /\.vue$/,
                use: 'vue-loader',
            },
        ],
    },
}
