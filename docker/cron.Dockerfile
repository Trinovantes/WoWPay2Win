# -----------------------------------------------------------------------------
FROM node:24-alpine AS base
# -----------------------------------------------------------------------------

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm

WORKDIR /app

COPY tsconfig.json              ./
COPY package.json               ./
COPY pnpm-workspace.yaml        ./
COPY pnpm-lock.yaml             ./
COPY patches/                   ./patches/

# -----------------------------------------------------------------------------
FROM base AS deps
# -----------------------------------------------------------------------------

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install \
        --frozen-lockfile \
        --production

# -----------------------------------------------------------------------------
FROM base AS builder
# -----------------------------------------------------------------------------

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install \
        --frozen-lockfile

# Copy app
COPY build/                     ./build/
COPY src/                       ./src/
COPY data/                      ./data/

# Fetch static data first
RUN --mount=type=secret,id=CLIENT_ID \
    --mount=type=secret,id=CLIENT_SECRET \
    --mount=type=secret,id=GIT_HASH \
    pnpm fetchItems && \
    pnpm fetchSocketIds && \
    pnpm fetchSecondaryIds

# Finally build frontend
RUN --mount=type=secret,id=GIT_HASH \
    pnpm build

# -----------------------------------------------------------------------------
FROM node:24-alpine
LABEL org.opencontainers.image.source=https://github.com/Trinovantes/WoWPay2Win
# -----------------------------------------------------------------------------

WORKDIR /app

ENV NODE_ENV='production'

# Install cron dependencies
RUN apk update && \
    apk add --no-cache git

# Copy app
COPY --from=deps /app/package.json      ./
COPY --from=deps /app/node_modules/     ./node_modules/
COPY docker/                            ./docker/
COPY build/                             ./build/
COPY data/                              ./data/
COPY src/                               ./src/
COPY .git/                              ./.git/

# Mount points
RUN mkdir -p                            ./data/regions/generated
RUN mkdir -p                            ./dist/web/data

RUN echo "0,30 * * * * cd /app && sh ./docker/cron.sh" >> /etc/crontabs/root
CMD ["crond", "-f"]
