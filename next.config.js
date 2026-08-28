const {PHASE_PRODUCTION_BUILD} = require('next/constants');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
};

/**
 * Deploy guard (tasks_todo.md Task 58 slice 3).
 *
 * A production build must produce PRODUCTION values. Two things could break that,
 * and both fail the build here rather than shipping a wrong app silently:
 *
 *  1. NODE_ENV is not 'production'. `next build` only DEFAULTS it
 *     (`process.env.NODE_ENV = process.env.NODE_ENV || defaultEnv` in
 *     next/dist/bin/next), so an inherited NODE_ENV=development from a shell or
 *     CI environment survives the build.
 *  2. NEXT_PUBLIC_QC_TEST_MODE is set. Nothing legitimately sets it in a
 *     production build — if it is there, a developer's .env.local has travelled
 *     somewhere it should not, so say so loudly.
 *
 * A red build in the Amplify log is cheap. Students quietly playing a test-mode
 * build for weeks is not — that is exactly what happened before this existed.
 */
const assertProductionBuildIsClean = () => {
    // HARD FAILURE — this is the only case that actually ships wrong values.
    if (process.env.NODE_ENV !== 'production') {
        throw new Error(
            '\n\n  PRODUCTION BUILD REFUSED — it would ship test-mode values.\n\n' +
            `  • NODE_ENV is "${process.env.NODE_ENV}", expected "production".\n` +
            '    next build only DEFAULTS NODE_ENV, so an inherited value from a\n' +
            '    shell or CI environment survives the build. Unset it (or set\n' +
            '    NODE_ENV=production) and rebuild.\n\n' +
            '  See lib/test-mode.ts for how the flag works.\n');
    }

    // WARNING ONLY — deliberately not fatal.
    //
    // With NODE_ENV=production, QC_TEST_MODE is false no matter what this flag
    // says, so the build is CORRECT. Failing here would break a legitimate
    // workflow: a developer with test mode enabled running `npm run build` to
    // check for compile errors, which the README actively recommends.
    //
    // It is still worth saying out loud: on a server it means a developer's
    // .env.local has travelled somewhere it should not, and the warning is
    // visible in the Amplify build log.
    if (process.env.NEXT_PUBLIC_QC_TEST_MODE === 'true') {
        console.warn(
            '\n  ⚠️  NEXT_PUBLIC_QC_TEST_MODE=true is set during a production build.\n' +
            '     The build is still correct — NODE_ENV=production forces production\n' +
            '     values — but that flag is for local development only. If you are\n' +
            '     seeing this on a server, a .env.local has been copied there.\n');
    }
};

module.exports = (phase) => {
    if (phase === PHASE_PRODUCTION_BUILD) {
        assertProductionBuildIsClean();
    }
    return nextConfig;
};
