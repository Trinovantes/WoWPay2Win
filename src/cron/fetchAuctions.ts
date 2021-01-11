import fetchRegions from './utils/fetchRegions'
import unrecognizedBonusIdTracker from './utils/UnrecognizedBonusIdTracker'

async function main() {
    try {
        const regions = await fetchRegions()

        for (const region of regions) {
            await region.fetchAuctions()
        }

        console.info('Cron Script Finished')

        if (DEFINE.IS_DEV) {
            unrecognizedBonusIdTracker.print()
        }
    } catch (err) {
        const error = err as Error
        console.error('Cron Script Failed:', error.message)
        if (DEFINE.IS_DEV) {
            console.error(error.stack)
        }
        process.exit(1)
    }
}

void main()
