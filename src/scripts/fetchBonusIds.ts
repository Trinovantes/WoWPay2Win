import fs from 'node:fs/promises'
import path from 'node:path'
import { Type } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { SECONDARY, type Secondary, type Difficulty, DIFFICULTY } from '../common/ItemBonusId.ts'
import { DIFFICULTY_BONUS_ID_DATA_FILE, SECONDARY_BONUS_ID_DATA_FILE, SOCKET_BONUS_ID_DATA_FILE } from '../common/Constants.ts'

type BonusId = number

type RaidbotsBonusJson = Record<string, unknown>

async function saveCache<T>(cache: Array<T>, filePath: string): Promise<void> {
    const fileContents = __IS_DEV__
        ? JSON.stringify(cache, null, 4)
        : JSON.stringify(cache)

    console.info(`Saving ${Object.keys(cache).length} bonusIds to ${filePath}`)
    await fs.writeFile(filePath, fileContents, 'utf-8')
}

async function main() {
    const res = await fetch('https://www.raidbots.com/static/data/live/bonuses.json')
    const bonusJson = await res.json() as RaidbotsBonusJson

    const secondaryBonusIds = getSecondaryBonusIds(bonusJson)
    const secondaryBonusIdsFilePath = path.resolve(SECONDARY_BONUS_ID_DATA_FILE)
    await saveCache(secondaryBonusIds, secondaryBonusIdsFilePath)

    const socketBonusIds = getSocketBonusIds(bonusJson)
    const socketBonusIdsFilePath = path.resolve(SOCKET_BONUS_ID_DATA_FILE)
    await saveCache(socketBonusIds, socketBonusIdsFilePath)

    const difficultyBonusIds = getDifficultyBonusIds(bonusJson)
    const difficultyBonusIdsFilePath = path.resolve(DIFFICULTY_BONUS_ID_DATA_FILE)
    await saveCache(difficultyBonusIds, difficultyBonusIdsFilePath)
}

main().catch((err) => {
    console.warn(err)
    process.exit(1)
})

// ----------------------------------------------------------------------------
// MARK: Secondary
// ----------------------------------------------------------------------------

const secondarySchema = Type.Object({
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

const secondaryValidator = TypeCompiler.Compile(secondarySchema)

export type SecondaryBonusIdsCacheFile = Array<
    [BonusId, Array<Secondary>]
>

function getSecondaryBonusIds(bonusJson: RaidbotsBonusJson): SecondaryBonusIdsCacheFile {
    const cache: SecondaryBonusIdsCacheFile = []

    for (const bonusIdData of Object.values(bonusJson)) {
        if (!secondaryValidator.Check(bonusIdData)) {
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

    return cache
}

// ----------------------------------------------------------------------------
// MARK: Socket
// ----------------------------------------------------------------------------

const socketBonusSchema = Type.Object({
    id: Type.Number(),
    socket: Type.Number(),
})

const socketyValidator = TypeCompiler.Compile(socketBonusSchema)

export type SocketBonusIdsCacheFile = Array<BonusId>

function getSocketBonusIds(bonusJson: RaidbotsBonusJson): SocketBonusIdsCacheFile {
    const cache: SocketBonusIdsCacheFile = []

    for (const bonusIdData of Object.values(bonusJson)) {
        if (!socketyValidator.Check(bonusIdData)) {
            continue
        }

        cache.push(bonusIdData.id)
    }

    return cache
}

// ----------------------------------------------------------------------------
// MARK: Difficulty
// ----------------------------------------------------------------------------

const difficultySchema = Type.Object({
    id: Type.Number(),
    tag: Type.String({
        pattern: '^(Fated )?(Raid Finder|Heroic|Mythic(?!\\+))',
    }),
})

const difficultyValidator = TypeCompiler.Compile(difficultySchema)

export type DifficultyBonusIdsCacheFile = Array<
    [BonusId, Difficulty]
>

function getDifficultyBonusIds(bonusJson: RaidbotsBonusJson): DifficultyBonusIdsCacheFile {
    const cache: DifficultyBonusIdsCacheFile = []

    for (const bonusIdData of Object.values(bonusJson)) {
        if (!difficultyValidator.Check(bonusIdData)) {
            continue
        }

        let difficulty: Difficulty = DIFFICULTY.NORMAL

        if (bonusIdData.tag.includes('Raid Finder')) {
            difficulty = DIFFICULTY.LFR
        }
        if (bonusIdData.tag.includes('Heroic')) {
            difficulty = DIFFICULTY.HEROIC
        }
        if (bonusIdData.tag.includes('Mythic')) {
            difficulty = DIFFICULTY.MYTHIC
        }

        cache.push([bonusIdData.id, difficulty])
    }

    return cache
}
