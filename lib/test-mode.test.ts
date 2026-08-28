/**
 * QC_TEST_MODE contract (tasks_todo.md Task 58 slice 3).
 *
 * Pins the switch itself, so a later refactor cannot quietly re-open the hole
 * that shipped test-mode photon counts to students for months. The decisive case
 * is the last one: even if a developer's .env.local reaches a server, a
 * PRODUCTION build must still yield production values.
 *
 * Each case re-imports the modules with `vi.resetModules()`, because
 * QC_TEST_MODE and the constants derived from it are evaluated once at import.
 */

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

const ORIGINAL_ENV = process.env;

/** Re-evaluate the flag and the derived constants under a given environment. */
const loadWithEnv = async (env: Record<string, string | undefined>) => {
    vi.resetModules();
    process.env = {...ORIGINAL_ENV, ...env};
    const [{QC_TEST_MODE}, bb84, e91, dps] = await Promise.all([
        import('./test-mode'),
        import('@/bb84-constants'),
        import('@/e91-constants'),
        import('@/dps-constants'),
    ]);
    return {QC_TEST_MODE, bb84, e91, dps};
};

describe('QC_TEST_MODE', () => {
    beforeEach(() => {
        process.env = {...ORIGINAL_ENV};
    });

    afterEach(() => {
        process.env = ORIGINAL_ENV;
        vi.resetModules();
    });

    it('is OFF when the flag is absent — absence means production', async () => {
        const {QC_TEST_MODE, bb84, e91} = await loadWithEnv({
            NODE_ENV: 'development',
            NEXT_PUBLIC_QC_TEST_MODE: undefined,
        });
        expect(QC_TEST_MODE).toBe(false);
        expect(bb84.BB84_SOLO_PHOTON_DEFAULT).toBe(10);
        expect(bb84.BB84_SOLO_PHOTON_MIN_WITH_EVE).toBe(16);
        expect(e91.E91_SOLO_PHOTON_DEFAULT).toBe(10);
    });

    it('is ON in development when a developer opts in', async () => {
        const {QC_TEST_MODE, bb84, e91} = await loadWithEnv({
            NODE_ENV: 'development',
            NEXT_PUBLIC_QC_TEST_MODE: 'true',
        });
        expect(QC_TEST_MODE).toBe(true);
        expect(bb84.BB84_SOLO_PHOTON_DEFAULT).toBe(4);
        expect(bb84.BB84_SOLO_PHOTON_MIN_WITH_EVE).toBe(6);
        expect(e91.E91_SOLO_PHOTON_DEFAULT).toBe(4);
    });

    it('stays OFF in a production build even if the flag leaked there', async () => {
        // The case that matters: a .env.local copied onto a server cannot
        // downgrade a production build to test values.
        const {QC_TEST_MODE, bb84, e91} = await loadWithEnv({
            NODE_ENV: 'production',
            NEXT_PUBLIC_QC_TEST_MODE: 'true',
        });
        expect(QC_TEST_MODE).toBe(false);
        expect(bb84.BB84_SOLO_PHOTON_DEFAULT).toBe(10);
        expect(bb84.BB84_SOLO_PHOTON_MIN_WITH_EVE).toBe(16);
        expect(e91.E91_SOLO_PHOTON_DEFAULT).toBe(10);
    });

    it('only the exact string "true" enables it', async () => {
        for (const value of ['1', 'yes', 'TRUE', 'True', '']) {
            const {QC_TEST_MODE} = await loadWithEnv({
                NODE_ENV: 'development',
                NEXT_PUBLIC_QC_TEST_MODE: value,
            });
            expect(QC_TEST_MODE, `value ${JSON.stringify(value)}`).toBe(false);
        }
    });

    it('DPS keeps identical test and production values, by design', async () => {
        // Ibra's decision (Task 58, item G): DPS's current numbers are fine for
        // production, but it keeps the two-value shape so a future change is a
        // one-line edit. Both modes must therefore agree today.
        const testMode = await loadWithEnv({
            NODE_ENV: 'development', NEXT_PUBLIC_QC_TEST_MODE: 'true',
        });
        const prodMode = await loadWithEnv({
            NODE_ENV: 'production', NEXT_PUBLIC_QC_TEST_MODE: undefined,
        });
        expect(testMode.dps.DPS_SOLO_PHOTON_DEFAULT)
            .toBe(prodMode.dps.DPS_SOLO_PHOTON_DEFAULT);
        expect(testMode.dps.DPS_SOLO_PHOTON_MIN)
            .toBe(prodMode.dps.DPS_SOLO_PHOTON_MIN);
        expect(testMode.dps.DPS_SOLO_PHOTON_MAX)
            .toBe(prodMode.dps.DPS_SOLO_PHOTON_MAX);
    });
});
