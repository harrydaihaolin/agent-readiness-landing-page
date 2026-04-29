export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink-700/60 bg-ink-900/80 backdrop-blur">
      <div className="container-narrow flex h-14 items-center justify-between">
        <a href="#top" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent-strong text-white">
            ar
          </span>
          <span>agent-readiness</span>
        </a>
        <nav className="hidden gap-6 text-sm text-white/70 md:flex">
          <a className="hover:text-white" href="#features">Features</a>
          <a className="hover:text-white" href="#pricing">Pricing</a>
          <a className="hover:text-white" href="#faq">FAQ</a>
          <a className="hover:text-white" href="https://github.com/harrydaihaolin/agent-readiness">
            GitHub
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            className="btn-ghost hidden md:inline-flex"
            href="https://github.com/harrydaihaolin/agent-readiness"
          >
            Star
          </a>
          <a className="btn-primary" href="#pricing">
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}
