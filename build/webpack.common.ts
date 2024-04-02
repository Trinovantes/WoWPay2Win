import path from 'node:path'
import { VueLoaderPlugin } from 'vue-loader'
import webpack, { DefinePlugin } from 'webpack'
import { isDev, srcDir, buildConstants } from './BuildConstants'

export const commonConfig: webpack.Configuration = {
    mode: isDev
        ? 'development'
        : 'production',
    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json', 'scss', '.css'],
        alias: {
            // Need to match aliases in tsconfig.json
            '@': path.resolve(srcDir),
        },
    },

    plugins: [
        new DefinePlugin(buildConstants),
        new VueLoaderPlugin(),
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
