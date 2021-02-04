import fetchRegions from '@cron/utils/fetchRegions'
import unrecognizedBonusIdTracker from '@cron/utils/UnrecognizedBonusIdTracker'

async function main() {
    if (process.argv.length !== 4) {
        console.info(process.argv)
        throw new Error('Expected dataDir and auctionsDir as arguments')
    }

    const dataDir = process.argv[3]
    const auctionsDir = process.argv[4]
    console.info('dataDir     =', dataDir)
    console.info('auctionsDir =', auctionsDir)

    const regions = await fetchRegions(dataDir, auctionsDir)

    for (const region of regions) {
        await region.fetchAuctions()
    }

    console.info('Cron Script Finished')

    if (DEFINE.IS_DEV) {
        unrecognizedBonusIdTracker.print()
    }
}

main()
    .then(() => {
        process.exit(0)
    })
    .catch((err) => {
        const error = err as Error
        console.error('Cron Script Failed:', error.name, error.message)

        if (DEFINE.IS_DEV) {
            console.error(error.stack)
        }

        process.exit(1)
    })
