import fetchRegions from '@cron/utils/fetchRegions'
import unrecognizedBonusIdTracker from '@cron/utils/UnrecognizedBonusIdTracker'

async function main() {
    const regions = await fetchRegions()

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
