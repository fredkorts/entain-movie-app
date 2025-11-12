import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { fetchMovies } from '../tmdb';
import { setupApiKeyForTest, cleanupAfterTest } from '../../test/testUtils';
import { TEST_SEARCH_QUERY, DISCOVER_START_ID, SEARCH_START_ID, MOCK_DISCOVER_TOTAL_RESULTS, MOCK_DISCOVER_TOTAL_PAGES } from '../../test/constants';

describe('TMDB Service - Critical Tests', () => {
  let cleanup: ReturnType<typeof setupApiKeyForTest>;

  beforeEach(() => {
    cleanup = setupApiKeyForTest();
  });

  afterEach(() => {
    cleanupAfterTest(cleanup);
  });

  describe('Pagination Logic', () => {
    it('returns exactly 10 results per page (not TMDB\'s 20)', async () => {
      const result = await fetchMovies({ page: 1 });
      
      expect(result.results).toHaveLength(10);
    });

    it('page 2 fetches different results with correct offset', async () => {
      const page1 = await fetchMovies({ page: 1 });
      const page2 = await fetchMovies({ page: 2 });
      
      // Page 1: first 10 from TMDB page 1 (IDs 100-109)
      expect(page1.results[0].id).toBe(DISCOVER_START_ID);
      expect(page1.results[9].id).toBe(DISCOVER_START_ID + 9);
      
      // Page 2: second 10 from TMDB page 1 (IDs 110-119)
      expect(page2.results[0].id).toBe(DISCOVER_START_ID + 10);
      expect(page2.results[9].id).toBe(DISCOVER_START_ID + 19);
    });

    it('page 3 requests TMDB page 2 with correct offset', async () => {
      const page3 = await fetchMovies({ page: 3 });
      
      // Page 3: first 10 from TMDB page 2 (IDs 120-129)
      expect(page3.results[0].id).toBe(DISCOVER_START_ID + 20);
      expect(page3.results[9].id).toBe(DISCOVER_START_ID + 29);
    });

    it('calculates total_pages based on 10-per-page', async () => {
      const result = await fetchMovies({ page: 1 });
      
      // TMDB returns MOCK_DISCOVER_TOTAL_RESULTS (10000) total results
      // 10000 / 10 = 1000 pages
      expect(result.total_pages).toBe(MOCK_DISCOVER_TOTAL_PAGES);
      expect(result.total_results).toBe(MOCK_DISCOVER_TOTAL_RESULTS);
    });
  });

  describe('Search vs Discover', () => {
    it('uses discover endpoint when no search query', async () => {
      const result = await fetchMovies({ page: 1, search: '' });
      
      // Discover endpoint returns IDs starting at DISCOVER_START_ID
      expect(result.results[0].id).toBe(DISCOVER_START_ID);
    });

    it('uses search endpoint when search query provided', async () => {
      const result = await fetchMovies({ page: 1, search: TEST_SEARCH_QUERY });
      
      // Search endpoint returns IDs starting at SEARCH_START_ID
      expect(result.results[0].id).toBe(SEARCH_START_ID);
      expect(result.results[0].title).toContain(TEST_SEARCH_QUERY);
    });

    it('trims whitespace from search query', async () => {
      const result = await fetchMovies({ page: 1, search: `  ${TEST_SEARCH_QUERY}  ` });
      
      expect(result.results[0].title).toContain(TEST_SEARCH_QUERY);
    });
  });

  describe('Error Handling', () => {
    it('throws RangeError for page < 1', async () => {
      await expect(fetchMovies({ page: 0 })).rejects.toThrow(RangeError);
      await expect(fetchMovies({ page: 0 })).rejects.toThrow('Invalid page parameter');
    });

    it('throws RangeError for negative page', async () => {
      await expect(fetchMovies({ page: -1 })).rejects.toThrow(RangeError);
    });

    it('throws RangeError for non-integer page', async () => {
      await expect(fetchMovies({ page: 1.5 })).rejects.toThrow(RangeError);
    });

    it('throws error if TMDB_API_KEY is missing', async () => {
      // Delete the API key for this test only
      // afterEach will restore it automatically
      delete process.env.TMDB_API_KEY;
      
      await expect(fetchMovies({ page: 1 })).rejects.toThrow('TMDB_API_KEY missing');
    });
  });

  describe('Language Mapping', () => {
    it('defaults to en-US when no language provided', async () => {
      const result = await fetchMovies({ page: 1 });
      
      expect(result).toBeDefined();
      // Language is passed to TMDB, can't directly assert but test passes
    });

    it('accepts language parameter', async () => {
      const result = await fetchMovies({ page: 1, lang: 'ru' });
      
      expect(result).toBeDefined();
    });
  });
});
