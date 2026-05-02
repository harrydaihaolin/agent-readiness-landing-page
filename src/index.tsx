// Conventional entry-point alias for src/main.tsx.
//
// Vite mounts the React app from src/main.tsx via the script tag in
// index.html; this file exists so any tooling that auto-discovers
// `index.{js,ts,tsx}` (including agent-readiness's
// entry_points.detected check) finds a clearly-named entry. It just
// imports main.tsx for its mount side-effect so it can also be used by
// SSR/test harnesses that pull in the canonical entry-point name.
import './main';

export {};
