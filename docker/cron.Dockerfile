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
FROM oven/bun:alpine
LABEL org.opencontainers.image.source=https://github.com/Trinovantes/WoWPay2Win
# -----------------------------------------------------------------------------

WORKDIR /app

ENV NODE_ENV='production'

# Install dependencies
RUN apk update && apk add --no-cache curl git

# Copy app
COPY --from=builder /app/tsconfig.json  ./
COPY --from=builder /app/package.json   ./
COPY --from=builder /app/node_modules/  ./node_modules/
COPY --from=builder /app/build/         ./build/
COPY --from=builder /app/src/           ./src/
COPY --from=builder /app/data/          ./data/
COPY docker/                            ./docker/
COPY .git/                              ./.git/

# Mount points
RUN mkdir -p                            ./data/regions/generated
RUN mkdir -p                            ./dist/web/data

RUN echo "0,30 * * * * cd /app && sh ./docker/cron.sh" >> /etc/crontabs/root
CMD ["crond", "-f"]
