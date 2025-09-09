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
FROM caddy:2-alpine
LABEL org.opencontainers.image.source=https://github.com/Trinovantes/WoWPay2Win
# -----------------------------------------------------------------------------

WORKDIR /app

# Copy app
COPY --from=builder /app/dist/          ./dist/
COPY ./docker/web.Caddyfile             /etc/caddy/Caddyfile

RUN caddy validate --config /etc/caddy/Caddyfile \
    && caddy fmt --overwrite /etc/caddy/Caddyfile
