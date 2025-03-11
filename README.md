# WoWPay2Win

At the beginning of the Ny'alotha raid in BfA, having the right corruption on gear drops (also available on BoEs) meant massive DPS increases. The gap was so big that it was nearly impossible to compete against players with BiS. As a result, many competitive players transferred to other realms and back just to buy their BiS for millions of gold.

Thankfully it was eventually remedied through the corruption vendor and removed after one tier. Nowadays, this tool simply scans for BoEs in every auction house across each region.

## Architecture

This app consists of two parts:

1. **Website:** (`src/web`)
    - This is a SPA built using Vue.js

2. **Cron script:** (`src/cron`)
    - This is a Node script responsible for fetching auction house data from Blizzard's API

These two parts are completely independent from each other where their only communication channel is through the generated `json` data files.

## Dev Setup

```bash
# Runs linter
yarn lint

# Note that the website requires game data from the API (localized item names and icon files) before it can be properly built
yarn buildCron
yarn fetchItems

# Starts webpack-dev-server on localhost:8080
yarn devWeb
```

## Building for Production

```bash
# Define CLIENT_ID and CLIENT_SECRET in this file
touch .env

make build # Creates Docker images
make run   # Starts Docker images
```

## Add New Tier

1. Create new file in `src/comon/tiers/` directory that default exports a `TierConfig` object. This config will be dynamically loaded via Webpack. The file should be of the form `XX-YY-descriptive-name` where `XX` is the expansion number (e.g. 07 for BfA) and `YY` is simply a number used to order the config (the last file in the filesystem will be considered the default/latest tier).

2. Run yarn fetchSocketIds to update BonusIds.ts

## Setting up GitHub Actions

Secret | Description
---    | ---
`SSH_USER` | Username of server
`SSH_HOST`| IP address of server
`SSH_PRIVATE_KEY`| `ssh-keygen -N '' -f ~/.ssh/github-actions -C "github-actions"` <br> Add `github-actions.pub` to `~/.ssh/authorized_keys` <br> Add `github-actions` to this secret
`SSH_KEYSCAN`| `ssh-keyscan -t ecdsa SSH_HOST`

### `ENV_FILE`

```sh
# From https://develop.battle.net/access/clients
CLIENT_ID=
CLIENT_SECRET=

# From Settings > Developer Settings (Auth Tokens)
SENTRY_ORG=
SENTRY_PROJECT=
SENTRY_AUTH_TOKEN=
```
