# -----------------------------------------------------------------------------
FROM node:22 AS builder
# -----------------------------------------------------------------------------

WORKDIR /app

# Install Bun
RUN yarn global add bun && \
    bun --version

# Install dependencies
COPY tsconfig.json              ./
COPY yarn.lock package.json     ./
COPY patches/                   ./patches/
RUN yarn install

# Copy app
COPY build/                     ./build/
COPY src/                       ./src/
COPY data/                      ./data/

# Fetch static data first
RUN --mount=type=secret,id=CLIENT_ID \
    --mount=type=secret,id=CLIENT_SECRET \
    --mount=type=secret,id=GIT_HASH \
    yarn fetchItems && \
    yarn fetchSocketIds

# Finally build frontend
RUN --mount=type=secret,id=GIT_HASH \
    yarn build

# Remove dev dependencies
RUN yarn install --production

# -----------------------------------------------------------------------------
FROM caddy:2-alpine
LABEL org.opencontainers.image.source=https://github.com/Trinovantes/WoWPay2Win
# -----------------------------------------------------------------------------

WORKDIR /app

# Copy app
COPY ./docker/web.Caddyfile     /etc/caddy/Caddyfile
COPY --from=builder /app/dist/  /app/dist/

RUN caddy validate --config /etc/caddy/Caddyfile \
    && caddy fmt --overwrite /etc/caddy/Caddyfile
