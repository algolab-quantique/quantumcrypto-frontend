/**
 * QC_TEST_MODE — the single test/production switch for all three protocols.
 *
 * Test mode lowers the solo photon minimums so a developer can play through a
 * game quickly by hand. Production values are the real ones students must get:
 * more photons means eavesdropping detection actually behaves like BB84 predicts
 * (see docs/protocol-physics.md — detection probability is 1 − (3/4)^v, so a
 * short game genuinely lets Eve slip through more often).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * HOW IT IS SWITCHED — it is a FILE, not a command.
 * ─────────────────────────────────────────────────────────────────────────────
 * `npm run dev` and `npm run build` are both used on laptops AND on servers, so
 * the command can never be the switch. The switch is the presence of a variable
 * in `.env.local` — a git-ignored file that exists only on developer machines.
 *
 *   ABSENCE = PRODUCTION.  Test mode is opt-in, and only in development.
 *
 * To turn it on for yourself, uncomment this line in your own `.env.local`
 * (never committed, so it cannot leak or reach production):
 *
 *     NEXT_PUBLIC_QC_TEST_MODE=true
 *
 * Then restart the dev server — Next.js reads env files at startup only.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY TWO CONDITIONS
 * ─────────────────────────────────────────────────────────────────────────────
 * The env var is the real switch. `NODE_ENV !== 'production'` is a second net,
 * for the case where a `.env.local` leaks onto a server: a production build then
 * ignores it anyway. A third net lives in `next.config.js`, which fails the build
 * outright if test mode would be active in a production build.
 *
 * Both `NODE_ENV` and `NEXT_PUBLIC_*` are inlined by Next.js at build time, so
 * this evaluates identically on the server and in the browser bundle.
 *
 * Replaces the old hand-edited `BB84_TEST_MODE` / `E91_TEST_MODE` /
 * `DPS_TEST_MODE` booleans, each of which shipped `= true` with a
 * "TODO: set to false for production" comment that nobody could be relied on to
 * remember (tasks_todo.md Task 57 / Task 58).
 */
export const QC_TEST_MODE =
    process.env.NODE_ENV !== 'production' &&
    process.env.NEXT_PUBLIC_QC_TEST_MODE === 'true';
