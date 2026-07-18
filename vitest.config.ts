import {defineConfig} from 'vitest/config';

// Testing strategy: docs/testing-strategy.md (Task 47).
// - resolve.tsconfigPaths resolves the app's `@/…` import aliases (native).
// - happy-dom provides localStorage/window for the store-backed lifecycle
//   tests without a real browser.
export default defineConfig({
    resolve: {tsconfigPaths: true},
    test: {
        environment: 'happy-dom',
        include: ['**/*.test.ts'],
        exclude: ['node_modules', '.next'],
    },
});
