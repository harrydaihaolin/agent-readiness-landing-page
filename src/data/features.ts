export interface Feature {
  pillar: 'cognitive_load' | 'feedback' | 'flow' | 'safety' | 'coordination' | 'inference';
  title: string;
  body: string;
  examples: string[];
}

export const features: Feature[] = [
  {
    pillar: 'cognitive_load',
    title: 'Cognitive load',
    body: 'How much context an agent has to load before it can act. Doc presence, naming clarity, repo shape.',
    examples: [
      'AGENTS.md present and parseable',
      'Module names that disambiguate (no utils.py colliding with utils.py)',
      'No 800-line files',
    ],
  },
  {
    pillar: 'feedback',
    title: 'Feedback loops',
    body: 'How fast an agent learns it broke something. Discoverable test commands, lint, types.',
    examples: [
      'Makefile target test or pyproject [project.scripts] entry',
      'Coverage hint present',
      'Linter/typer in CI',
    ],
  },
  {
    pillar: 'flow',
    title: 'Flow',
    body: 'How few steps from clone to running. Lockfiles, .env.example, single entry point.',
    examples: [
      '.env.example covers every os.environ.get()',
      'project.scripts or main entry point',
      'Lockfile committed',
    ],
  },
  {
    pillar: 'safety',
    title: 'Safety',
    body: 'How safe to let an agent loose. No leaked secrets, no destructive defaults.',
    examples: [
      'No AKIA / sk- credential patterns',
      'No rm -rf in default targets',
      'Sandbox-aware tooling',
    ],
  },
  {
    pillar: 'coordination',
    title: 'Coordination (workspaces)',
    body: 'Multi-repo only. Can agents operate coherently across N sibling repos? Root AGENTS.md, member repos declared, dep / change order documented.',
    examples: [
      'Root AGENTS.md with a "Repos in this workspace" section',
      'Dependency / publish order documented',
      'Cross-repo invariants captured (e.g. protocol pin)',
    ],
  },
  {
    pillar: 'inference',
    title: 'Ontology / inference',
    body: 'Derived findings — violations the scanner infers from your declared ontology via a hand-rolled forward-chainer. Six rules ship in v3.3.0+.',
    examples: [
      'Coupled consumers must agree on the major version',
      'Repo claims Releasable without a release workflow',
      'Cross-tenant Action chain without an intent template',
    ],
  },
];
