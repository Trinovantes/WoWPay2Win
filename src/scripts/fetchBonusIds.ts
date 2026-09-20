import fs from 'node:fs/promises'
import path from 'node:path'
import { Type } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { SECONDARY, type Secondary, type Difficulty, DIFFICULTY, type Upgrade } from '../common/ItemBonusId.ts'
import { DIFFICULTY_BONUS_ID_DATA_FILE, RAIDBOTS_BONUS_ID_DATA_FILE, SECONDARY_BONUS_ID_DATA_FILE, SOCKET_BONUS_ID_DATA_FILE, UPGRADE_BONUS_ID_DATA_FILE } from '../common/Constants.ts'
import type { BonusId } from '../common/api/BnetResponse.ts'
import { existsSync } from 'node:fs'

type RaidbotsBonusIds = Record<string, unknown>

async function saveCache<T>(cache: T, filePath: string): Promise<void> {
    const fileContents = __IS_DEV__
        ? JSON.stringify(cache, null, 4)
        : JSON.stringify(cache)

    if (Array.isArray(cache)) {
        console.info(`Saving ${cache.length} bonusIds to ${filePath}`)
    } else {
        console.info(`Saving ${filePath}`)
    }

    await fs.writeFile(filePath, fileContents, 'utf-8')
}

async function fetchRaidbotsBonusIds(): Promise<RaidbotsBonusIds> {
    const raidbotsBonusIdsFilePath = path.resolve(RAIDBOTS_BONUS_ID_DATA_FILE)

    if (!existsSync(RAIDBOTS_BONUS_ID_DATA_FILE)) {
        const res = await fetch('https://www.raidbots.com/static/data/live/bonuses.json')
        const bonusIds = await res.json() as RaidbotsBonusIds
        await saveCache(bonusIds, raidbotsBonusIdsFilePath)
    }

    const bonusIdsJson = (await fs.readFile(raidbotsBonusIdsFilePath)).toString('utf-8')
    const bonusIds = JSON.parse(bonusIdsJson) as RaidbotsBonusIds

    return bonusIds
}

async function main() {
    const bonusIds = await fetchRaidbotsBonusIds()

    const secondaryBonusIds = getSecondaryBonusIds(bonusIds)
    const secondaryBonusIdsFilePath = path.resolve(SECONDARY_BONUS_ID_DATA_FILE)
    await saveCache(secondaryBonusIds, secondaryBonusIdsFilePath)

    const socketBonusIds = getSocketBonusIds(bonusIds)
    const socketBonusIdsFilePath = path.resolve(SOCKET_BONUS_ID_DATA_FILE)
    await saveCache(socketBonusIds, socketBonusIdsFilePath)

    const difficultyBonusIds = getDifficultyBonusIds(bonusIds)
    const difficultyBonusIdsFilePath = path.resolve(DIFFICULTY_BONUS_ID_DATA_FILE)
    await saveCache(difficultyBonusIds, difficultyBonusIdsFilePath)

    const upgradeBonusIds = getUpgradeBonusIds(bonusIds)
    const upgradeBonusIdsFilePath = path.resolve(UPGRADE_BONUS_ID_DATA_FILE)
    await saveCache(upgradeBonusIds, upgradeBonusIdsFilePath)
}

main().catch((err) => {
    console.warn(err)
    process.exit(1)
})

// ----------------------------------------------------------------------------
// MARK: Secondary
// ----------------------------------------------------------------------------

const secondarySchema = Type.Object({
    id: Type.Unsafe<BonusId>(Type.Number()),
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

function getSecondaryBonusIds(bonusIds: RaidbotsBonusIds): SecondaryBonusIdsCacheFile {
    const cache: SecondaryBonusIdsCacheFile = []

    for (const bonusIdData of Object.values(bonusIds)) {
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
    id: Type.Unsafe<BonusId>(Type.Number()),
    socket: Type.Number(),
})

const socketyValidator = TypeCompiler.Compile(socketBonusSchema)

export type SocketBonusIdsCacheFile = Array<BonusId>

function getSocketBonusIds(bonusIds: RaidbotsBonusIds): SocketBonusIdsCacheFile {
    const cache: SocketBonusIdsCacheFile = []

    for (const bonusIdData of Object.values(bonusIds)) {
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
    id: Type.Unsafe<BonusId>(Type.Number()),
    tag: Type.String({
        pattern: '^(Fated )?(Raid Finder|Heroic|Mythic(?!\\+))',
    }),
})

const difficultyValidator = TypeCompiler.Compile(difficultySchema)

export type DifficultyBonusIdsCacheFile = Array<
    [BonusId, Difficulty]
>

function getDifficultyBonusIds(bonusIds: RaidbotsBonusIds): DifficultyBonusIdsCacheFile {
    const cache: DifficultyBonusIdsCacheFile = []

    for (const bonusIdData of Object.values(bonusIds)) {
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

// ----------------------------------------------------------------------------
// MARK: Upgrade
// ----------------------------------------------------------------------------

const upgradeSchema = Type.Object({
    id: Type.Unsafe<BonusId>(Type.Number()),
    quality: Type.Number(),
    itemLevel: Type.Object({
        amount: Type.Number(),
        priority: Type.Number(),
        squishEra: Type.Number(),
    }),
    upgrade: Type.Object({
        level: Type.Number(), // Current upgrade level
        max: Type.Number(), // Max upgrade level
        name: Type.String(), // e.g. Hero
        fullName: Type.String(), // e.g. Hero 1/6
        itemLevel: Type.Number(),
        seasonId: Type.Number(),
    }),
})

const upgradeValidator = TypeCompiler.Compile(upgradeSchema)

export type UpgradeBonusIdsCacheFile = Array<
    [BonusId, Upgrade]
>

function getUpgradeBonusIds(bonusIds: RaidbotsBonusIds): UpgradeBonusIdsCacheFile {
    const cache: UpgradeBonusIdsCacheFile = []

    for (const bonusIdData of Object.values(bonusIds)) {
        if (!upgradeValidator.Check(bonusIdData)) {
            continue
        }

        cache.push([bonusIdData.id, {
            name: bonusIdData.upgrade.name,
            currentLvl: bonusIdData.upgrade.level,
            maxLvl: bonusIdData.upgrade.max,
            iLvl: bonusIdData.upgrade.itemLevel,
        }])
    }

    return cache
}
