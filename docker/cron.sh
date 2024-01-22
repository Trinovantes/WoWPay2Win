#!/usr/bin/env sh

set -e # Exit on error
set -u # Error when undefined variable

# SENTRY_CRONS="https://o504161.ingest.sentry.io/api/5590531/cron/fetch-auctions/ba1fbe840db046beb61f9ae59e888924/"

# curl "${SENTRY_CRONS}?status=in_progress"

yarn fetchAuctions

# curl "${SENTRY_CRONS}?status=ok"
