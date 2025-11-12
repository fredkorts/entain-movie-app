/**
 * Test Constants
 * 
 * Centralized constants used across backend tests for consistency
 * and easy maintenance.
 */

// ============================================================================
// Environment Variables
// ============================================================================

/** Mock API key used in all tests */
export const TEST_API_KEY = 'test-api-key';

// ============================================================================
// Mock Movie IDs
// ============================================================================

/** Valid movie ID used for successful requests (Fight Club) */
export const VALID_MOVIE_ID = 550;

/** Non-existent movie ID used for 404 tests */
export const NONEXISTENT_MOVIE_ID = 999999;

// ============================================================================
// Mock ID Ranges (from MSW handlers)
// ============================================================================

/** Starting ID for discover endpoint mock responses */
export const DISCOVER_START_ID = 100;

/** Starting ID for search endpoint mock responses */
export const SEARCH_START_ID = 200;

// ============================================================================
// Test Query Values
// ============================================================================

/** Sample search query used in tests */
export const TEST_SEARCH_QUERY = 'batman';

// ============================================================================
// Mock Data Limits (from controllers/movies.ts)
// ============================================================================

/** Maximum number of backdrops returned in movie detail */
export const MAX_BACKDROPS = 12;

/** Maximum number of posters returned in movie detail */
export const MAX_POSTERS = 8;

/** Maximum number of reviews returned in movie detail */
export const MAX_REVIEWS = 5;

// ============================================================================
// Mock Totals (from MSW handlers)
// ============================================================================

/** Total results returned by discover endpoint mock */
export const MOCK_DISCOVER_TOTAL_RESULTS = 10000;

/** Total pages calculated for discover endpoint (10000 / 10) */
export const MOCK_DISCOVER_TOTAL_PAGES = 1000;

/** Total results returned by search endpoint mock */
export const MOCK_SEARCH_TOTAL_RESULTS = 1000;

/** Total pages calculated for search endpoint (1000 / 10) */
export const MOCK_SEARCH_TOTAL_PAGES = 100;
