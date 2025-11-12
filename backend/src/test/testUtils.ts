/**
 * Test Utilities
 * 
 * Helper functions for common test setup and teardown patterns.
 */

import { server } from './mocks/server';
import { TEST_API_KEY } from './constants';

/**
 * Setup function for tests that need TMDB_API_KEY
 * 
 * Usage in beforeEach:
 * ```typescript
 * let cleanup: ReturnType<typeof setupApiKeyForTest>;
 * 
 * beforeEach(() => {
 *   cleanup = setupApiKeyForTest();
 * });
 * 
 * afterEach(() => {
 *   cleanup();
 * });
 * ```
 * 
 * @returns Cleanup function to restore original env var state
 */
export function setupApiKeyForTest(): () => void {
  const originalApiKey = process.env.TMDB_API_KEY;
  process.env.TMDB_API_KEY = TEST_API_KEY;

  return () => {
    // Restore original env var state
    if (originalApiKey !== undefined) {
      process.env.TMDB_API_KEY = originalApiKey;
    } else {
      delete process.env.TMDB_API_KEY;
    }
  };
}

/**
 * Complete cleanup function for tests
 * Resets MSW handlers and cleans up environment variables
 * 
 * Usage in afterEach:
 * ```typescript
 * afterEach(() => {
 *   cleanupAfterTest(cleanup);
 * });
 * ```
 * 
 * @param envCleanup Optional cleanup function from setupApiKeyForTest
 */
export function cleanupAfterTest(envCleanup?: () => void): void {
  // Reset MSW handlers to default state
  server.resetHandlers();
  
  // Clean up environment variables if cleanup function provided
  if (envCleanup) {
    envCleanup();
  }
}
