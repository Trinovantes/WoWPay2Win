import path from 'node:path'
import { getGitHash } from './BuildSecret.ts'
import { REGIONS_DATA_DIR, ITEMS_DATA_DIR, ITEMS_ICON_DIR, TIERS_CONFIG_DIR, TIERS_ICON_DIR, AUCTIONS_DATA_DIR, SOCKET_BONUS_ID_DATA_FILE, SECONDARY_BONUS_ID_DATA_FILE } from '../src/common/Constants.ts'

// Assume we are running webpack from the project root (../)
const rootDir = path.resolve()

export const isDev = (process.env.NODE_ENV === 'development')
export const gitHash = getGitHash(rootDir)

export const distDir = path.resolve(rootDir, 'dist')
export const distScriptsDir = path.resolve(distDir, 'scripts')
export const distWebDir = path.resolve(distDir, 'web')

export const srcDir = path.resolve(rootDir, 'src')
export const srcScriptsDir = path.resolve(srcDir, 'scripts')
export const srcWebDir = path.resolve(srcDir, 'web')
export const staticDir = path.resolve(srcDir, 'web', 'static')

export const buildConstants = {
    __VUE_OPTIONS_API__: JSON.stringify(false),
    __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),

    __IS_DEV__: JSON.stringify(isDev),
    __GIT_HASH__: JSON.stringify(gitHash),

    __REGIONS_DATA_DIR__: JSON.stringify(path.resolve(REGIONS_DATA_DIR)),
    __ITEMS_DATA_DIR__: JSON.stringify(path.resolve(ITEMS_DATA_DIR)),
    __ITEMS_ICON_DIR__: JSON.stringify(path.resolve(ITEMS_ICON_DIR)),
    __TIERS_CONFIG_DIR__: JSON.stringify(path.resolve(TIERS_CONFIG_DIR)),
    __TIERS_ICON_DIR__: JSON.stringify(path.resolve(TIERS_ICON_DIR)),
    __AUCTIONS_DATA_DIR__: JSON.stringify(path.resolve(AUCTIONS_DATA_DIR)),
    __SOCKET_BONUS_ID_DATA_FILE__: JSON.stringify(path.resolve(SOCKET_BONUS_ID_DATA_FILE)),
    __SECONDARY_BONUS_ID_DATA_FILE__: JSON.stringify(path.resolve(SECONDARY_BONUS_ID_DATA_FILE)),
}
