import fs from 'node:fs/promises'
import path from 'node:path'
import { Type } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { SECONDARY, type Secondary } from '../common/ItemBonusId.ts'
import { SECONDARY_BONUS_ID_DATA_FILE } from '../common/Constants.ts'

const secondaryBonusSchema = Type.Object({
    id: Type.Number(),
    rawStats: Type.Array(
        Type.Object({
            stat: Type.Number(),
            amount: Type.Number(),
            name: Type.String(),
        }),
    ),
    stats: Type.String(),
    name: Type.String(),
})

const validator = TypeCompiler.Compile(secondaryBonusSchema)

export type CachedSecondaryIdsFile = Array<
    [number, Array<Secondary>]
>

async function main() {
    const bonusJson = await (await fetch('https://www.raidbots.com/static/data/live/bonuses.json')).json() as Record<string, unknown>
    const cache: CachedSecondaryIdsFile = []

    for (const bonusIdData of Object.values(bonusJson)) {
        if (!validator.Check(bonusIdData)) {
            continue
        }

        const secondaries = bonusIdData.rawStats
            .map((stat) => {
                switch (stat.name) {
                    case 'Crit': return SECONDARY.CRIT
                    case 'Haste': return SECONDARY.HASTE
                    case 'Mastery': return SECONDARY.MASTERY
                    case 'Vers': return SECONDARY.VERS
                }

                return null
            })
            .filter((secondary) => {
                return secondary !== null
            })

        if (secondaries.length === 0) {
            continue
        }

        cache.push([bonusIdData.id, secondaries])
    }

    const filePath = path.resolve(SECONDARY_BONUS_ID_DATA_FILE)
    const fileContents = __IS_DEV__
        ? JSON.stringify(cache, null, 4)
        : JSON.stringify(cache)

    console.info(`Saving ${Object.keys(cache).length} secondary bonusIds to ${filePath}`)
    await fs.writeFile(filePath, fileContents, 'utf-8')
}

main().catch((err) => {
    console.warn(err)
    process.exit(1)
})
