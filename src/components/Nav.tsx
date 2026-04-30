import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { MouseEvent } from 'react';

export default function Nav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onHome = pathname === '/' || pathname === '';

  const scrollToOnHome = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-ink-700/60 bg-ink-900/80 backdrop-blur">
      <div className="container-narrow flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent-strong text-white">
            ar
          </span>
          <span>agent-readiness</span>
        </Link>
        <nav className="hidden gap-6 text-sm text-white/70 md:flex">
          <a className="hover:text-white" href="/" onClick={scrollToOnHome('features')}>
            Features
          </a>
          <a className="hover:text-white" href="/" onClick={scrollToOnHome('pricing')}>
            Pricing
          </a>
          <a className="hover:text-white" href="/" onClick={scrollToOnHome('faq')}>
            FAQ
          </a>
          <Link className="hover:text-white" to="/blog">Blog</Link>
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
          <a className="btn-primary" href="/" onClick={scrollToOnHome('pricing')}>
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}
