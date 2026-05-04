export interface FaqItem {
  q: string;
  a: string;
}

export const faqs: FaqItem[] = [
  {
    q: 'Does the scanner phone home?',
    a: 'No. agent-readiness runs entirely locally. It never makes outbound network calls during a scan.',
  },
  {
    q: 'How is this different from a linter?',
    a: 'Linters check style and known anti-patterns inside files. agent-readiness scores how easily an autonomous agent can navigate, change, and verify the whole repo — across cognitive load, feedback, flow, and safety pillars.',
  },
  {
    q: 'Can I add a custom rule?',
    a: 'Yes. The agent-readiness-rules repo accepts community PRs. Each rule is one YAML file describing a match (file pattern, regex, manifest field, etc.), an explanation, and an action an agent can apply.',
  },
  {
    q: 'How do I integrate with Claude Code or Cursor?',
    a: 'Use the agent-readiness-mcp server (stdio MCP), the agent-readiness-claude-skill, or the agent-readiness-vscode extension. Each ships under MIT and wraps the same scan + apply_top_action engine.',
  },
  {
    q: 'How does this hold up across languages and stack sizes?',
    a: 'The public leaderboard scores 994 popular AI / agent repos across nine topics and four star bands. Headline result: 77.7% are missing canonical AGENTS.md, even at 20k+ stars. The full breakdown lives at the leaderboard URL in the nav.',
  },
  {
    q: 'Is this open source?',
    a: 'Yes. Scanner, rules pack, MCP server, Claude Code skill, VS Code extension, gh extension, and pre-commit hook are all MIT licensed. Fork it, run it offline, build on top.',
  },
];
