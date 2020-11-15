# WoWPay2Win

At the beginning of the Ny'alotha raid in BfA, having the right corruption on gear drops (also available on BoEs) meant massive DPS increases. The gap was so big that it was nearly impossible to compete against players with BiS. As a result, many competitive players transferred to other realms and back just to buy their BiS for millions of gold.

Nowadays, this tool simply scans for BoEs in every auction house across the region.

## Architecture

This app consists of two parts:

1. **Website:** (`src/web`)
    - This is a SPA built using Vue.js
    - It is compiled by GitHub Actions and is hosted using GitHub Pages (see `gh-pages` branch)

2. **Cron script:** (`src/cron`)
    - This is a Node script responsible for fetching auction house data from Blizzard's API
    - It is scheduled to run once every hour by GitHub Actions
    - The GitHub Action also commits its generated data (`dist-web/data/*.json`) to the `gh-pages` branch

These two parts are completely independent from each other where their only communication channel is through the generated `json` data files.

## Dev Setup

### Prereq

- `node`
- `yarn`

### Commands

```bash
# Watches the src/cron directory and recompiles changes
yarn cron

# Starts webpack-dev-server on localhost:8080
yarn web

# Runs linter
yarn lint
```

I recommend doing cron script development in VS Code because this repository is already configured to launch the scripts inside VS Code using `F5`. We just need to run `yarn cron` in a separate terminal first.

Note that the website requires game data from the API (localized item names and icon files) before it can be properly built. We just need to first compile the cron scripts `yarn buildCron` and get the game data `yarn fetchData` before running `yarn web`.

## Building for Production

```bash
yarn buildCron     # Builds the cron scripts
yarn fetchData     # Fetch game data (regions, connected realms, items)
yarn fetchAuctions # Fetch auction house data
yarn buildWeb      # Builds the website
```

Once everything is compiled, we just need to serve `dist-web` to the public.
