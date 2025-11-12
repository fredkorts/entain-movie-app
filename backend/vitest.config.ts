import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'src/test/**',
        '**/__tests__/**',
        '**/*.test.ts',
        'dist/**',
      ],
      thresholds: {
        lines: 75,
        functions: 60,
        branches: 45,
        statements: 75,
      },
    },
  },
});
