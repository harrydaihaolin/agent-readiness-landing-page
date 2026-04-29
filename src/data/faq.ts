export interface FaqItem {
  q: string;
  a: string;
}

export const faqs: FaqItem[] = [
  {
    q: 'Does the OSS scanner phone home?',
    a: 'No. agent-readiness runs entirely locally. The Pro tier may call your configured insights engine; the OSS package never makes outbound network calls.',
  },
  {
    q: 'How is this different from a linter?',
    a: 'Linters check style and known anti-patterns inside files. agent-readiness scores how easily an autonomous agent can navigate, change, and verify the whole repo — across cognitive load, feedback, flow, and safety pillars.',
  },
  {
    q: 'Can I add a custom rule?',
    a: 'Yes. The agent-readiness-rules repo accepts community PRs. Each rule is one YAML file describing a match (file pattern, regex, manifest field, etc.) and an explanation. Pro adds private match types like ast_query and lockfile_drift on top.',
  },
  {
    q: 'What changed between 1.0 and 1.1?',
    a: 'agent-readiness 1.1 ships the rules-pack evaluator (vendored from agent-readiness-rules@v1.0.0) and a rules-eval diagnostic command. The scan output schema is unchanged.',
  },
  {
    q: 'How do I integrate with Claude Code or Cursor?',
    a: 'Bronze ships a stdio MCP server (agent-readiness-mcp). Pro adds insights_search and evaluate_with_insights MCP tools that hit the closed engine.',
  },
  {
    q: 'When does Enterprise ship?',
    a: 'No public ETA yet. Drop your email on the Enterprise card and we will reach out when it is time.',
  },
];
