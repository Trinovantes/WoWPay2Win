import { fetchRegions } from './utils/fetchRegions'
import { unrecognizedBonusIdTracker } from '@/cron/utils/UnrecognizedBonusIdTracker'
import path from 'path'
import { mkdirp } from './utils/mkdirp'

async function main() {
    if (process.argv.length !== 4) {
        console.info(process.argv)
        throw new Error('Expected dataDir and auctionsDir as arguments')
    }

    const dataDir = path.resolve(process.argv[2])
    const auctionsDir = path.resolve(process.argv[3])
    console.table({
        dataDir,
        auctionsDir,
    })

    mkdirp(dataDir)
    mkdirp(auctionsDir)

    const regions = await fetchRegions(dataDir, auctionsDir)
    for (const region of regions) {
        await region.fetchAuctions()

        if (DEFINE.IS_DEV) {
            break
        }
    }

    unrecognizedBonusIdTracker.print()
}

main()
    .then(() => {
        console.info('Cron Script Finished')
        process.exit(0)
    }).catch((err) => {
        const error = err as Error
        console.warn('Cron Script Failed')
        console.warn(error.stack)
        process.exit(1)
    })
