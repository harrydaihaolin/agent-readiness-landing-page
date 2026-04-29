export type TierId = 'bronze' | 'silver' | 'team' | 'enterprise';

export type CtaKind = 'primary' | 'ghost' | 'email';

export interface Tier {
  id: TierId;
  name: string;
  tagline: string;
  price: string;
  priceCadence?: string;
  highlight: boolean;
  badge?: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaKind: CtaKind;
}

export const tiers: Tier[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    tagline: 'Free, open source. Score any repo.',
    price: '$0',
    priceCadence: 'forever',
    highlight: false,
    features: [
      'agent-readiness scan . CLI (22 checks + OSS rules pack)',
      '5 OSS match types',
      'agent-readiness-action GitHub Action — CI in one line',
      'JSON / SARIF / HTML / score-badge outputs',
      'Public leaderboard browsing',
      'Contribute a rule via agent-readiness-rules',
      'MIT licensed; community support',
    ],
    ctaLabel: 'View on GitHub',
    ctaHref: 'https://github.com/harrydaihaolin/agent-readiness',
    ctaKind: 'ghost',
  },
  {
    id: 'silver',
    name: 'Silver',
    tagline: 'Pro. RAG-enriched insights, advanced match types.',
    price: 'Early access',
    badge: 'Most popular',
    highlight: true,
    features: [
      'Everything in Bronze',
      'pip install agent-readiness-pro (private wheel)',
      'Closed insights engine: RAG-enriched related_insights[] per finding',
      'Advanced match types: ast_query, churn_signal, complex_regex_combinator, lockfile_drift',
      '--insights flag on scan; MCP integration for Claude Code & Cursor',
      'Insights search API (rate-limited)',
      '--run Docker runtime checks',
    ],
    ctaLabel: 'Request access',
    ctaHref: 'mailto:agent-readiness@example.com?subject=Silver%20early%20access',
    ctaKind: 'primary',
  },
  {
    id: 'team',
    name: 'Team',
    tagline: 'For squads. Org-scoped tokens, custom rule packs.',
    price: '$$',
    priceCadence: 'per seat / month',
    highlight: false,
    features: [
      'Everything in Silver',
      'Team-scoped Insights API tokens',
      'GitHub App: PR check + auto-comment (planned)',
      'Custom rule packs (org-specific YAML overlaying OSS pack)',
      'Org-wide score tracking dashboard',
      'Slack / Discord notifications',
      'SSO via GitHub OIDC',
    ],
    ctaLabel: 'Contact sales',
    ctaHref: 'mailto:agent-readiness@example.com?subject=Team%20tier',
    ctaKind: 'ghost',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'On-prem RAG, SLAs, audit log. Stay tuned.',
    price: 'Stay tuned',
    highlight: false,
    badge: 'Coming soon',
    features: [
      'On-prem / VPC RAG (private corpus, no external embeddings)',
      'SLA + dedicated support',
      'Custom check development; roadmap influence',
      'SOC 2, audit log, SAML',
      'Volume pricing',
    ],
    ctaLabel: 'Get notified',
    ctaHref: 'mailto:agent-readiness@example.com?subject=Enterprise%20interest',
    ctaKind: 'email',
  },
];
