export interface Stat {
  label: string;
  value: string;
  detail?: string;
}

// Keep these copy-only for v0; a follow-up will hydrate at build time
// from agent-readiness-leaderboard's scores.json.
export const stats: Stat[] = [
  { label: 'Repos benchmarked', value: '120+', detail: 'on the public leaderboard' },
  { label: 'Checks shipped', value: '22 + 7', detail: 'core + OSS rule pack' },
  { label: 'Median score', value: '64', detail: 'across the public sample' },
  { label: 'PRs to fix-hint', value: '< 5 min', detail: 'using --json + agent loop' },
];
