import path from 'path'

export const isDev = (process.env.NODE_ENV === 'development')

export const projectDir = path.resolve(__dirname, '..')
export const staticDir = path.resolve(projectDir, 'static')
export const distCronDir = path.resolve(projectDir, 'dist-cron')
export const distWebDir = path.resolve(projectDir, 'dist-web')

export const srcDir = path.resolve(projectDir, 'src')
export const srcCronDir = path.resolve(srcDir, 'cron')
export const srcWebDir = path.resolve(srcDir, 'web')
