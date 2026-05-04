import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-ink-700/60 bg-ink-900/80">
      <div className="container-narrow flex flex-col items-start justify-between gap-6 py-10 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="grid h-6 w-6 place-items-center rounded bg-accent-strong text-xs text-white">
              ar
            </span>
            agent-readiness
          </div>
          <p className="mt-2 max-w-md text-xs text-white/50">
            MIT-licensed scanner, rules pack, and every distribution surface.
            Built by maintainers, for maintainers.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm text-white/65 md:grid-cols-3">
          <Link className="hover:text-white" to="/blog">Blog</Link>
          <a className="hover:text-white" href="https://github.com/harrydaihaolin/agent-readiness">CLI</a>
          <a className="hover:text-white" href="https://github.com/harrydaihaolin/agent-readiness-rules">Rules</a>
          <a className="hover:text-white" href="https://github.com/harrydaihaolin/agent-readiness-action">Action</a>
          <a className="hover:text-white" href="https://github.com/harrydaihaolin/agent-readiness-fixtures">Fixtures</a>
          <a className="hover:text-white" href="https://github.com/harrydaihaolin/agent-readiness-insights-protocol">Protocol</a>
          <a className="hover:text-white" href="https://github.com/harrydaihaolin/agent-readiness-leaderboard">Leaderboard</a>
        </nav>
      </div>
      <div className="container-narrow border-t border-ink-700/60 py-4 text-xs text-white/40">
        © {new Date().getFullYear()} agent-readiness contributors.
      </div>
    </footer>
  );
}
