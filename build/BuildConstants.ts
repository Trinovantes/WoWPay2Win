import path from 'path'
import { getGitHash } from './BuildSecret'

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

export const buildConstants = {
    __VUE_OPTIONS_API__: JSON.stringify(false),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(false),

    'DEFINE.IS_DEV': JSON.stringify(isDev),
    'DEFINE.GIT_HASH': JSON.stringify(gitHash),
}
