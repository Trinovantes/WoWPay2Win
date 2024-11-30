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

# Remove dev dependencies
RUN yarn install --production

# -----------------------------------------------------------------------------
FROM node:22-alpine
LABEL org.opencontainers.image.source https://github.com/Trinovantes/WoWPay2Win
# -----------------------------------------------------------------------------

RUN apk update && apk add --no-cache curl

WORKDIR /app

ENV NODE_ENV 'production'

# Copy app
COPY --from=builder /app/package.json   ./
COPY --from=builder /app/node_modules   ./node_modules
COPY --from=builder /app/dist/          ./dist/
COPY docker/                            ./docker

# Mount points
RUN mkdir -p                            ./src/web/client/assets/data
RUN mkdir -p                            ./dist/web/data

RUN echo "0,30 * * * * cd /app && sh ./docker/cron.sh" >> /etc/crontabs/root
CMD crond -f
