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

# We build scripts in production instead of running as-is like in development because we want to embed BuildConstants
RUN --mount=type=secret,id=GIT_HASH \
    yarn buildScripts

# Remove dev dependencies
RUN yarn install --production

# -----------------------------------------------------------------------------
FROM oven/bun:alpine
LABEL org.opencontainers.image.source=https://github.com/Trinovantes/WoWPay2Win
# -----------------------------------------------------------------------------

WORKDIR /app
ENV NODE_ENV='production'

# Install curl (for pinging sentry)
RUN apk update && apk add --no-cache curl

# Copy app
COPY --from=builder /app/tsconfig.json  ./
COPY --from=builder /app/package.json   ./
COPY --from=builder /app/node_modules/  ./node_modules/
COPY --from=builder /app/dist/          ./dist/
COPY --from=builder /app/src/           ./src/
COPY --from=builder /app/data/          ./data/
COPY docker/                            ./docker/

# Mount points
RUN mkdir -p                            ./data/regions/generated
RUN mkdir -p                            ./dist/web/data

RUN echo "0,30 * * * * cd /app && sh ./docker/cron.sh" >> /etc/crontabs/root
CMD ["crond", "-f"]
