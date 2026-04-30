import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { getPost } from '../data/posts';

type FetchState =
  | { status: 'loading' }
  | { status: 'ready'; markdown: string }
  | { status: 'error'; message: string };

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : undefined;
  const [state, setState] = useState<FetchState>({ status: 'loading' });

  useEffect(() => {
    if (!slug) {
      setState({ status: 'error', message: 'No post specified.' });
      return;
    }
    if (!post) {
      setState({ status: 'error', message: 'Post not found.' });
      return;
    }

    const url = `${import.meta.env.BASE_URL}posts/${slug}.md`;
    setState({ status: 'loading' });

    let cancelled = false;
    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Failed to load (${res.status})`);
        }
        return res.text();
      })
      .then((markdown) => {
        if (!cancelled) {
          setState({ status: 'ready', markdown });
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setState({ status: 'error', message: err.message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug, post]);

  if (!post) {
    return (
      <section className="container-narrow py-20">
        <p className="text-white/70">
          That post does not exist. <Link to="/blog" className="text-accent">Back to the blog</Link>.
        </p>
      </section>
    );
  }

  return (
    <article className="container-narrow py-16 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Link to="/blog" className="text-sm text-white/50 hover:text-white">
          ← All posts
        </Link>
        <header className="mt-6 border-b border-ink-700/60 pb-8">
          <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-white/50">
            <time dateTime={post.date}>{post.date}</time>
            <span aria-hidden>·</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-white/70">{post.excerpt}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-ink-600 bg-ink-800/60 px-2.5 py-0.5 text-xs text-white/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="mt-10">
          {state.status === 'loading' && (
            <p className="text-white/60">Loading…</p>
          )}
          {state.status === 'error' && (
            <p className="text-red-400/80">Could not load this post: {state.message}</p>
          )}
          {state.status === 'ready' && (
            <div className="prose prose-invert prose-lg max-w-none prose-headings:scroll-mt-24 prose-headings:tracking-tight prose-a:text-accent-soft hover:prose-a:text-accent prose-code:rounded prose-code:bg-ink-700/70 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.95em] prose-code:before:content-none prose-code:after:content-none prose-pre:bg-ink-800/80 prose-pre:border prose-pre:border-ink-700 prose-blockquote:border-accent/60 prose-blockquote:text-white/80 prose-hr:border-ink-700">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  a: ({ href, children, ...rest }) => {
                    const isInternal = typeof href === 'string' && href.startsWith('/');
                    if (isInternal) {
                      return (
                        <Link to={href!} {...(rest as Record<string, unknown>)}>
                          {children}
                        </Link>
                      );
                    }
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {state.markdown}
              </ReactMarkdown>
            </div>
          )}
        </div>

        <footer className="mt-16 border-t border-ink-700/60 pt-8 text-sm text-white/60">
          Found this useful? Star{' '}
          <a
            className="text-accent-soft hover:text-accent"
            href="https://github.com/harrydaihaolin/agent-readiness"
          >
            agent-readiness on GitHub
          </a>{' '}
          or check the{' '}
          <a
            className="text-accent-soft hover:text-accent"
            href="https://harrydaihaolin.github.io/agent-readiness-leaderboard/"
          >
            live leaderboard
          </a>
          .
        </footer>
      </div>
    </article>
  );
}
