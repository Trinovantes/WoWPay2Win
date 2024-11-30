# -----------------------------------------------------------------------------
FROM node:22-alpine as builder
# -----------------------------------------------------------------------------

WORKDIR /app

# Install dependencies
COPY tsconfig.json              ./
COPY yarn.lock package.json     ./
RUN yarn install

# Build app
COPY build/                     ./build/
COPY src/                       ./src/
RUN --mount=type=secret,id=GIT_HASH \
    yarn buildCron

# Fetch static data from API first
RUN --mount=type=secret,id=CLIENT_ID \
    --mount=type=secret,id=CLIENT_SECRET \
    yarn fetchItems

# Finally build frontend
RUN --mount=type=secret,id=GIT_HASH \
    yarn buildWeb

# -----------------------------------------------------------------------------
FROM caddy:2-alpine
LABEL org.opencontainers.image.source https://github.com/Trinovantes/WoWPay2Win
# -----------------------------------------------------------------------------

WORKDIR /app

# Copy app
COPY ./docker/web.Caddyfile     /etc/caddy/Caddyfile
COPY --from=builder /app/dist   /app/dist/
