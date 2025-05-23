import { BunPlugin, Glob } from 'bun'
import path from 'node:path'

export type PreprocessorOpts = Partial<{
    defines: Record<string, string>
}>

export function createPreprocessorPlugin(opts?: PreprocessorOpts): BunPlugin {
    const cwd = path.resolve()
    const filter = new RegExp(`${cwd}/(?!node_modules/).+\\.(js|jsx|ts|tsx|mjs|cjs|vue)$`)

    return {
        name: 'PreprocessorPlugin',
        setup(build) {
            build.onLoad({
                filter: filter,
                namespace: 'file',
            }, async(args) => {
                let contents = await Bun.file(args.path).text()
                contents = processDefines(contents, opts)
                contents = await processImportMetaGlob(contents, args.path)

                return {
                    contents,
                }
            })
        },
    }
}

// ----------------------------------------------------------------------------
// MARK: DefinePlugin
// ----------------------------------------------------------------------------

function processDefines(contents: string, opts?: PreprocessorOpts): string {
    if (!opts?.defines) {
        return contents
    }

    for (const [key, value] of Object.entries(opts.defines)) {
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
        const regex = new RegExp(`\\b${escapedKey}\\b`, 'g')

        contents = contents.replace(regex, value)
    }

    return contents
}

// ----------------------------------------------------------------------------
// MARK: import.meta.glob
// ----------------------------------------------------------------------------

declare global {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface ImportMeta {
        glob: (path: string) => Record<string, () => Promise<unknown>>
    }
}

async function processImportMetaGlob(contents: string, srcFilePath: string): Promise<string> {
    while (true) {
        const globRegex = /import\.meta\.glob\(\s*['"`](?<importPath>.+?)['"`]\s*\)/
        const matches = globRegex.exec(contents)
        const globPattern = matches?.groups?.importPath
        if (!matches || !globPattern) {
            break
        }

        const cwd = path.dirname(srcFilePath)
        const globPath = path.join(cwd, globPattern)
        const glob = new Glob(globPath)

        const filePaths = await Array.fromAsync(glob.scan('.'))
        const imports = filePaths.map((filePath) => `'${filePath}': () => import('${filePath}')`)
        const importStmt = `({ ${imports.join(',')} })`

        const startIdx = matches.index
        const endIdx = matches.index + matches[0].length

        contents = contents.substring(0, startIdx) + importStmt + contents.substring(endIdx)
    }

    return contents
}
