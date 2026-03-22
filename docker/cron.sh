#!/usr/bin/env sh

set -e # Exit on error
set -u # Error when undefined variable

SENTRY_INGEST="https://o504161.ingest.us.sentry.io"
SENTRY_CRONS="${SENTRY_INGEST}/api/5590531/cron/wowpay2win-cron/ba1fbe840db046beb61f9ae59e888924/"

curl "${SENTRY_CRONS}?status=in_progress"

npm run fetchAuctions

if [ $? -eq 0 ]; then
    curl "${SENTRY_CRONS}?status=ok"
else
    curl "${SENTRY_CRONS}?status=error"
fi
