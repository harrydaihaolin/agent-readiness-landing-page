#!/usr/bin/env node
/**
 * Build-time stats hydration.
 *
 * Fetches the leaderboard's published scores.json, derives headline
 * stats (total repos, median score, last-updated date), and writes
 * src/data/stats.generated.ts. If the network is unreachable (offline
 * builds, restricted CI), falls back to src/data/stats.fallback.json so
 * the build still succeeds with the last-known values.
 *
 * Triggered automatically by `npm run prebuild`. Can also be run by hand:
 *
 *   node scripts/fetch_stats.mjs
 *
 * Override the URL with:
 *
 *   AR_LEADERBOARD_SCORES_URL=https://example.com/scores.json \
 *     node scripts/fetch_stats.mjs
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const DATA_DIR = resolve(ROOT, 'src/data');
const OUT_PATH = resolve(DATA_DIR, 'stats.generated.ts');
const FALLBACK_PATH = resolve(DATA_DIR, 'stats.fallback.json');

const URL =
  process.env.AR_LEADERBOARD_SCORES_URL ||
  'https://harrydaihaolin.github.io/agent-readiness-leaderboard/data/scores.json';

const TIMEOUT_MS = Number(process.env.AR_FETCH_TIMEOUT_MS || 8000);

function median(nums) {
  if (!nums.length) return null;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function validateScoresEnvelope(scores) {
  // ML1: lightweight schema check on the leaderboard envelope.
  // Mirrors the JSON Schema in agent-readiness-leaderboard/schemas/
  // scores.schema.json — we only enforce the fields this script
  // actually consumes, so a well-meaning addition upstream doesn't
  // red the build. A *missing* required field, or one with the wrong
  // type, is the failure mode this catches (and the failure mode that
  // motivated ML1).
  if (scores == null || typeof scores !== 'object') {
    throw new Error('scores envelope is not an object');
  }
  if (!Array.isArray(scores.repos)) {
    throw new Error('scores.repos is missing or not an array');
  }
  if (typeof scores.last_updated !== 'string' || !scores.last_updated) {
    throw new Error('scores.last_updated must be a non-empty string');
  }
  // ML4 depends on scores.checks_count being present and numeric.
  // It's allowed to be missing on legacy snapshots (we'll fall back
  // to a constant), but if present it must be a positive integer.
  if (
    scores.checks_count !== undefined &&
    (!Number.isInteger(scores.checks_count) || scores.checks_count <= 0)
  ) {
    throw new Error(
      `scores.checks_count must be a positive integer, got ${JSON.stringify(scores.checks_count)}`,
    );
  }
  return scores;
}

function deriveStats(scores) {
  validateScoresEnvelope(scores);
  const repos = Array.isArray(scores?.repos) ? scores.repos : [];
  const overallScores = repos
    .map((r) => Number(r?.overall_score))
    .filter((n) => Number.isFinite(n));
  return {
    totalRepos: repos.length || Number(scores?.total_repos || 0),
    // ML4: derive checks-shipped count from the envelope rather than
    // hardcoding the integer in render(). Falls back to null on legacy
    // envelopes that don't include checks_count, in which case
    // render() degrades to a literal placeholder rather than lying.
    checksCount: Number.isInteger(scores?.checks_count)
      ? scores.checks_count
      : null,
    medianScore: median(overallScores),
    lastUpdated: scores?.last_updated || null,
    source: scores?.source || URL,
  };
}

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function loadFallback() {
  if (!existsSync(FALLBACK_PATH)) {
    throw new Error(
      `No fallback found at ${FALLBACK_PATH}; cannot generate stats.`,
    );
  }
  return JSON.parse(readFileSync(FALLBACK_PATH, 'utf8'));
}

function fmtDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(+d)) return null;
  return d.toISOString().slice(0, 10);
}

// Static metadata about the v3 frozen cohort release. Lives outside
// the daily scores.json envelope (it's a one-shot immutable artefact),
// so we record it here and fold it into the rendered stats. Update
// when a future v4 freeze lands.
const V3_COHORT = {
  label: 'Largest cohort scanned',
  value: '1000+ repos',
  detail: 'stratified across 9 topics / 4 star bands',
  href: 'https://github.com/harrydaihaolin/agent-readiness-leaderboard/releases/tag/v3-2026-05-01',
};

function render(stats, source) {
  const asOf = fmtDate(stats.lastUpdated);
  const detail = (text) =>
    asOf ? `${text} (as of ${asOf})` : text;
  // Deliberately exclude the wall-clock generation time so reruns
  // produce stable git diffs (and only change when the upstream feed
  // actually changes).
  // ML4: prefer the envelope's checks_count over a hardcoded literal.
  // Fall back to '—' on legacy envelopes so a missing field shows as
  // an em-dash rather than a stale lie.
  const checksValue = stats.checksCount == null ? '—' : String(stats.checksCount);
  return [
    '/* eslint-disable */',
    '// Auto-generated by scripts/fetch_stats.mjs. Do not edit by hand.',
    `// Source: ${source}`,
    "import type { Stat } from './stats';",
    '',
    'export const stats: Stat[] = [',
    `  { label: 'Repos benchmarked', value: '${stats.totalRepos}+', detail: ${JSON.stringify(detail('on the public leaderboard'))} },`,
    `  { label: 'Checks shipped', value: '${checksValue}', detail: 'YAML rules across all four pillars' },`,
    `  { label: 'Median score', value: '${stats.medianScore == null ? '—' : Math.round(stats.medianScore)}', detail: ${JSON.stringify(detail('across the public sample'))} },`,
    "  { label: 'PRs to fix-hint', value: '< 5 min', detail: 'using --json + agent loop' },",
    `  { label: ${JSON.stringify(V3_COHORT.label)}, value: ${JSON.stringify(V3_COHORT.value)}, detail: ${JSON.stringify(V3_COHORT.detail)}, href: ${JSON.stringify(V3_COHORT.href)} },`,
    '];',
    '',
  ].join('\n');
}

async function main() {
  let scores;
  let usedFallback = false;
  try {
    console.log(`[fetch_stats] GET ${URL}`);
    scores = await fetchWithTimeout(URL, TIMEOUT_MS);
  } catch (err) {
    console.warn(`[fetch_stats] live fetch failed: ${err.message}`);
    console.warn(`[fetch_stats] falling back to ${FALLBACK_PATH}`);
    scores = loadFallback();
    usedFallback = true;
  }

  const stats = deriveStats(scores);
  console.log(`[fetch_stats] derived:`, stats, usedFallback ? '(fallback)' : '(live)');

  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(OUT_PATH, render(stats, usedFallback ? `${FALLBACK_PATH} (offline)` : URL));
  console.log(`[fetch_stats] wrote ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(`[fetch_stats] fatal:`, err);
  process.exit(1);
});
