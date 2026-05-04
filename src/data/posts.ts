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
    title: 'I scanned 1000 AI / agent repos. 77.7% ship without canonical AGENTS.md.',
    date: '2026-05-02',
    excerpt:
      "The v2 article looked at 96 curated AI infra repos. v3 stratifies discovery across 9 topics × 4 star bands and lands on 994 cleanly-scanned repos under rules pack v1.4.0 (37 checks): 77.7% have no AGENTS.md at the project root, and even at 20k+ stars 49% still miss it. Stratified slices by language, star band, and seed topic — and four named case studies.",
    readingTime: '14 min read',
    tags: ['agents', 'data', 'open-source', 'rules-pack-v1.4.0'],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getSortedPosts(): Post[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
}
