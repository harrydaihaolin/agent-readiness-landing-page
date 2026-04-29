#!/usr/bin/env bash
# Convenience wrapper for `npm run dev`. Lets contributors and the
# agent-readiness scanner discover the canonical "run the app" entry.
set -euo pipefail
cd "$(dirname "$0")/.."
exec npm run dev "$@"
