export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readingTime: string;
  tags: string[];
};

export const posts: Post[] = [
  {
    slug: 'introducing-agent-readiness',
    title: 'Introducing agent-readiness: scoring repos for the agent era',
    date: '2026-04-30',
    excerpt:
      'AI coding agents are headless developers. They suffer from the same DevEx friction the SPACE/DevEx research has measured for years — and they cannot ask a senior for help. agent-readiness puts a number on it.',
    readingTime: '8 min read',
    tags: ['agents', 'devex', 'open-source'],
  },
  {
    slug: 'scanning-100-ai-repos',
    title: 'I scanned 96 popular AI infra repos. Most are not agent ready.',
    date: '2026-04-30',
    excerpt:
      '64% of the most-starred AI infrastructure repos ship without any agent-targeted documentation. Three are functionally unrunnable end-to-end by an agent. AutoGPT has an 11-byte CLAUDE.md. The data, with names.',
    readingTime: '7 min read',
    tags: ['agents', 'data', 'open-source'],
  },
  {
    slug: 'scanning-1000-ai-repos-v3',
    title: 'I scanned 1000 AI / agent repos. The 64% pattern holds at scale.',
    date: '2026-05-02',
    excerpt:
      "The v2 article looked at 96 curated AI infra repos. v3 stratifies the search across 9 topics × 4 star bands and lands on 994 successfully-scanned repos: 67.7% still ship without agent-targeted docs. Replicates v2's headline at 10× the cohort, with stratified slices by language and star band.",
    readingTime: '12 min read',
    tags: ['agents', 'data', 'open-source', 'rules-pack-v1.4.0'],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getSortedPosts(): Post[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}
