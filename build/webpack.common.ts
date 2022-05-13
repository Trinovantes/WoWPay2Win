import path from 'path'
import { VueLoaderPlugin } from 'vue-loader'
import webpack, { DefinePlugin } from 'webpack'
import { getGitHash } from './utils/BuildSecret'

// ----------------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------------

// Assume we are running webpack from the project root (../)
const rootDir = path.resolve()

export const isDev = (process.env.NODE_ENV === 'development')
export const gitHash = getGitHash(rootDir)

export const distDir = path.resolve(rootDir, 'dist')
export const distCronDir = path.resolve(distDir, 'cron')
export const distWebDir = path.resolve(distDir, 'web')

export const srcDir = path.resolve(rootDir, 'src')
export const srcCronDir = path.resolve(srcDir, 'cron')
export const srcWebDir = path.resolve(srcDir, 'web')
export const staticDir = path.resolve(srcDir, 'web', 'static')

// ----------------------------------------------------------------------------
// Common
// ----------------------------------------------------------------------------

export const commonConfig: webpack.Configuration = {
    mode: isDev
        ? 'development'
        : 'production',
    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json', '.scss', '.css'],
        alias: {
            // Need to match aliases in tsconfig.json
            '@': path.resolve(srcDir),
        },
    },

    plugins: [
        new DefinePlugin({
            __VUE_OPTIONS_API__: JSON.stringify(true),
            __VUE_PROD_DEVTOOLS__: JSON.stringify(false),

            'DEFINE.IS_DEV': JSON.stringify(isDev),
            'DEFINE.GIT_HASH': JSON.stringify(gitHash),
        }),
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
                        target: 'es2020',
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
