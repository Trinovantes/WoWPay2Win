import path from 'path'

export const isDev = (process.env.NODE_ENV === 'development')

const rootDir = path.resolve() // Assume we are running from the project root

export const staticDir = path.resolve(rootDir, 'static')

const distDir = path.resolve(rootDir, 'dist')
export const distCronDir = path.resolve(distDir, 'cron')
export const distWebDir = path.resolve(distDir, 'web')

export const srcDir = path.resolve(rootDir, 'src')
export const srcCronDir = path.resolve(srcDir, 'cron')
export const srcWebDir = path.resolve(srcDir, 'web')
