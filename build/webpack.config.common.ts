import path from 'path'
import webpack, { DefinePlugin } from 'webpack'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { VueLoaderPlugin } from 'vue-loader'

// ----------------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------------

export const isDev = (process.env.NODE_ENV === 'development')

// Assume we are running webpack from the project root (../)
const rootDir = path.resolve()

const distDir = path.resolve(rootDir, 'dist')
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
            __VUE_OPTIONS_API__: JSON.stringify(false),
            __VUE_PROD_DEVTOOLS__: JSON.stringify(true),

            'DEFINE.IS_DEV': JSON.stringify(isDev),
        }),
        new MiniCssExtractPlugin({
            filename: isDev
                ? '[name].css'
                : '[name].[contenthash].css',
            chunkFilename: isDev
                ? '[name].css'
                : '[name].[contenthash].css',
        }),
        new VueLoaderPlugin(),
    ],

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
                test: /\.(sass|scss)$/,
                use: [
                    isDev
                        ? 'style-loader'
                        : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            additionalData: (content: string, loaderContext: { resourcePath: string }): string => {
                                return (loaderContext.resourcePath.endsWith('sass'))
                                    ? '@import "@/web/assets/css/variables.scss"\n' + content
                                    : '@import "@/web/assets/css/variables.scss";' + content
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(jpe?g|png|gif|svg|webp)$/i,
                type: 'asset/inline',
            },
            {
                test: /\.(ttf|eot|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                type: 'asset',
            },
        ],
    },
}
