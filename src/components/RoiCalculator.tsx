import { useMemo, useState } from 'react';
import { ROI_DEFAULTS, computeRoi, formatUsd } from '../data/roi';

type RevealState =
  | { kind: 'gated' }
  | { kind: 'submitting' }
  | { kind: 'revealed'; email: string }
  | { kind: 'error'; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RoiCalculator() {
  const [seats, setSeats] = useState<number>(ROI_DEFAULTS.seats);
  const [currentScore, setCurrentScore] = useState<number>(ROI_DEFAULTS.currentScore);
  const [targetScore, setTargetScore] = useState<number>(ROI_DEFAULTS.targetScore);
  const [email, setEmail] = useState('');
  const [reveal, setReveal] = useState<RevealState>({ kind: 'gated' });

  const result = useMemo(
    () => computeRoi({ seats, currentScore, targetScore }),
    [seats, currentScore, targetScore],
  );

  const onReveal = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setReveal({ kind: 'error', message: 'Enter a work email so we can send the breakdown.' });
      return;
    }
    setReveal({ kind: 'submitting' });
    try {
      window.localStorage?.setItem('roi_email_submitted', email);
    } catch {
      // localStorage unavailable; ignore — reveal still works.
    }
    setReveal({ kind: 'revealed', email });
  };

  return (
    <section className="container-narrow py-20">
      <header className="mb-10 max-w-2xl">
        <span className="pill mb-3">Calculator</span>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          What is the readiness gap costing you?
        </h1>
        <p className="mt-3 text-white/70">
          A back-of-envelope estimate of how much of your AI-coding spend is
          stuck behind a low agent-readiness score, and how much you would
          recover if you closed the gap. Punch in your numbers; we will email
          you the breakdown.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="card space-y-5">
          <div>
            <label className="text-sm font-medium text-white/80" htmlFor="roi-seats">
              Engineering seats on AI tooling
            </label>
            <input
              id="roi-seats"
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value || '0', 10))}
              className="mt-2 w-full rounded-md border border-ink-600 bg-ink-800/80 px-3 py-2 text-sm text-white outline-none focus:border-accent"
            />
            <p className="mt-1 text-xs text-white/50">
              Roughly your headcount paying for Cursor, Copilot, Claude Code, etc.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-white/80" htmlFor="roi-current">
              Current readiness score: <span className="font-mono text-accent-soft">{currentScore}</span>
            </label>
            <input
              id="roi-current"
              type="range"
              min={0}
              max={100}
              step={1}
              value={currentScore}
              onChange={(e) => setCurrentScore(parseInt(e.target.value, 10))}
              className="mt-2 w-full accent-accent"
            />
            <p className="mt-1 text-xs text-white/50">
              Run <code className="font-mono">agent-readiness scan .</code> if you do not know yours.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-white/80" htmlFor="roi-target">
              Target readiness score: <span className="font-mono text-accent-soft">{targetScore}</span>
            </label>
            <input
              id="roi-target"
              type="range"
              min={0}
              max={100}
              step={1}
              value={targetScore}
              onChange={(e) => setTargetScore(parseInt(e.target.value, 10))}
              className="mt-2 w-full accent-accent"
            />
            <p className="mt-1 text-xs text-white/50">
              90 is the gate we ship in CI. 70 is a reasonable first milestone.
            </p>
          </div>
        </article>

        <article className="card flex flex-col">
          <div className="text-sm uppercase tracking-wider text-white/50">
            Score gap
          </div>
          <div className="mt-1 text-3xl font-semibold tracking-tight text-white">
            {result.scoreGap} points
          </div>
          <div className="mt-6 text-sm uppercase tracking-wider text-white/50">
            Estimated annual recovery
          </div>
          <div
            className={`mt-1 text-4xl font-semibold tracking-tight ${
              reveal.kind === 'revealed' ? 'text-accent-soft' : 'blur-sm select-none'
            }`}
            aria-hidden={reveal.kind !== 'revealed'}
          >
            {formatUsd(result.estimatedRecovery)}
            <span className="ml-2 text-base font-normal text-white/50">/ year</span>
          </div>
          <div
            className={`mt-1 text-sm text-white/60 ${
              reveal.kind === 'revealed' ? '' : 'blur-sm select-none'
            }`}
            aria-hidden={reveal.kind !== 'revealed'}
          >
            ≈ {formatUsd(result.monthlyRecovery)} / month
          </div>

          {reveal.kind === 'revealed' ? (
            <div className="mt-8 rounded-lg border border-accent/40 bg-accent/10 p-4 text-sm text-white/85">
              <p className="font-medium text-white">
                Sent to <span className="font-mono">{reveal.email}</span>.
              </p>
              <p className="mt-2">
                Watch your inbox for a one-pager that walks through how the
                number was computed and the five fixes most likely to close
                your gap.
              </p>
            </div>
          ) : (
            <form onSubmit={onReveal} className="mt-8 space-y-3">
              <label className="text-sm font-medium text-white/80" htmlFor="roi-email">
                Reveal the dollar figure + send the breakdown
              </label>
              <input
                id="roi-email"
                type="email"
                placeholder="you@yourcompany.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-ink-600 bg-ink-800/80 px-3 py-2 text-sm text-white outline-none focus:border-accent"
              />
              <button
                className="btn-primary w-full"
                type="submit"
                disabled={reveal.kind === 'submitting'}
              >
                {reveal.kind === 'submitting' ? 'Sending…' : 'Reveal & email me'}
              </button>
              {reveal.kind === 'error' && (
                <p className="text-xs text-rose-300/90">{reveal.message}</p>
              )}
              <p className="text-xs text-white/40">
                One email. No newsletter. Unsubscribe with one click.
              </p>
            </form>
          )}
        </article>
      </div>

      <footer className="mt-10 max-w-3xl text-xs text-white/45">
        <p>
          This is a back-of-envelope estimate, not a guarantee. The model
          assumes a recovery factor of {ROI_DEFAULTS.recoveryFactor.toFixed(2)} —
          we will tighten that number once the SWE-bench × top-action
          experiment lands. Source code:{' '}
          <a
            className="underline underline-offset-2 hover:text-accent"
            href="https://github.com/harrydaihaolin/agent-readiness-landing-page/blob/main/src/data/roi.ts"
          >
            src/data/roi.ts
          </a>
          .
        </p>
      </footer>
    </section>
  );
}
