# -----------------------------------------------------------------------------
FROM node:20 as builder
# -----------------------------------------------------------------------------

WORKDIR /app

# Install dependencies
COPY tsconfig.json              ./
COPY yarn.lock package.json     ./
COPY node_modules               ./node_modules
RUN yarn install

# Build app
COPY build/                     ./build/
COPY src/                       ./src/
RUN --mount=type=secret,id=GIT_HASH \
    yarn buildCron

# -----------------------------------------------------------------------------
FROM node:20-alpine
LABEL org.opencontainers.image.source https://github.com/Trinovantes/WoWPay2Win
# -----------------------------------------------------------------------------

WORKDIR /app

ENV NODE_ENV 'production'

# Install dependencies
COPY yarn.lock package.json     ./
COPY node_modules               ./node_modules
RUN yarn install

# Mount points
RUN mkdir -p                    ./src/web/client/assets/data
RUN mkdir -p                    ./dist/web/data

# Copy app
COPY --from=builder /app/dist/  ./dist/

RUN echo "30 * * * * cd /app && yarn fetchAuctions" >> /etc/crontabs/root
CMD crond -f
