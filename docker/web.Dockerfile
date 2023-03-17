# -----------------------------------------------------------------------------
FROM node:18 as builder
# -----------------------------------------------------------------------------

WORKDIR /app

# Install dependencies
COPY tsconfig.json              ./
COPY yarn.lock package.json     ./
COPY patches/                   ./patches/
RUN yarn install

# Build app
COPY babel.config.js            ./
COPY build/                     ./build/
COPY src/                       ./src/

RUN --mount=type=secret,id=GIT_HASH \
    yarn buildCron

RUN --mount=type=secret,id=CLIENT_ID \
    --mount=type=secret,id=CLIENT_SECRET \
    yarn fetchItems

RUN --mount=type=secret,id=GIT_HASH \
    yarn buildWeb

# -----------------------------------------------------------------------------
FROM nginx:alpine
LABEL org.opencontainers.image.source https://github.com/Trinovantes/WoWPay2Win
# -----------------------------------------------------------------------------

WORKDIR /app

COPY ./docker/web.conf          /etc/nginx/conf.d/default.conf
COPY ./docker/general.conf      /app/general.conf
COPY --from=builder /app/dist   /app/dist

RUN nginx -t
