# Contributing

Thanks for thinking about the marketing site! Three tips:

1. **Copy lives in `src/data/`.** If you're updating tier text, FAQ
   answers, or pillar examples, that's the place — components are
   generic shells.
2. **One PR per change.** Keep scope tight; the site stays easy to
   review.
3. **Run `make build` before opening the PR.** TypeScript is strict;
   ESLint runs in CI.

## Adding a tier

Append a `Tier` to `src/data/tiers.ts`. The `<Pricing>` grid auto-sizes
up to 4 cards; if you add a 5th, update the `xl:grid-cols-4` class on
`<Pricing>`.

## Code of conduct

Be kind. Disagree about the change, not the person.
