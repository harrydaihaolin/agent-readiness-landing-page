import { Link } from 'react-router-dom';
import { getSortedPosts } from '../data/posts';

export default function BlogList() {
  const posts = getSortedPosts();

  return (
    <section className="container-narrow py-20 md:py-28">
      <div className="max-w-3xl">
        <span className="pill mb-6">Blog</span>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Notes from the agent-readiness lab
        </h1>
        <p className="mt-5 text-lg text-white/70">
          Research, leaderboard data, and the occasional opinion about what
          actually makes a codebase ready for AI coding agents.
        </p>
      </div>

      <ul className="mt-14 grid gap-6 md:grid-cols-2">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              to={`/blog/${p.slug}`}
              className="card group block h-full transition hover:border-accent/60 hover:bg-ink-700/70"
            >
              <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-white/50">
                <time dateTime={p.date}>{p.date}</time>
                <span aria-hidden>·</span>
                <span>{p.readingTime}</span>
              </div>
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-white group-hover:text-accent-soft">
                {p.title}
              </h2>
              <p className="mt-3 text-sm text-white/70">{p.excerpt}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-ink-600 bg-ink-800/60 px-2.5 py-0.5 text-xs text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
