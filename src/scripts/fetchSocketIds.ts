type Result = Record<string, {
    id: number
    socket?: number
}>

async function fetchSocketIds() {
    const socketIds = new Set<number>()
    const bonusJson = await (await fetch('https://www.raidbots.com/static/data/live/bonuses.json')).json() as Result

    for (const [, data] of Object.entries(bonusJson)) {
        if (data.socket !== 1) {
            continue
        }

        socketIds.add(data.id)
    }

    console.info(socketIds)
}

fetchSocketIds().catch((err: unknown) => {
    console.warn(err)
})
