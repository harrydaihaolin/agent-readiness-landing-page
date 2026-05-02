export interface Stat {
  label: string;
  value: string;
  detail?: string;
}

// `stats.generated.ts` is built by `scripts/fetch_stats.mjs` (wired into
// the `prebuild` / `predev` npm scripts). It hydrates from the leaderboard's
// public scores.json and falls back to `stats.fallback.json` when the
// network is unreachable. If you're seeing a "module not found" error here,
// run `node scripts/fetch_stats.mjs` once to materialise the file.
export { stats } from './stats.generated';
