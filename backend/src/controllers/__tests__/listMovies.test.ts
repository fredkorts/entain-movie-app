import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../index';
import { setupApiKeyForTest, cleanupAfterTest } from '../../test/testUtils';
import { TEST_SEARCH_QUERY, SEARCH_START_ID } from '../../test/constants';

describe('Movies List Controller - Critical Tests', () => {
  let cleanup: ReturnType<typeof setupApiKeyForTest>;

  beforeEach(() => {
    cleanup = setupApiKeyForTest();
  });

  afterEach(() => {
    cleanupAfterTest(cleanup);
  });

  describe('Basic Functionality', () => {
    it('returns 200 with movie list', async () => {
      const response = await request(app).get('/movies');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('results');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('total_pages');
      expect(response.body).toHaveProperty('total_results');
    });

    it('returns array of movies with correct structure', async () => {
      const response = await request(app).get('/movies');

      expect(Array.isArray(response.body.results)).toBe(true);
      expect(response.body.results.length).toBeGreaterThan(0);
      
      const movie = response.body.results[0];
      expect(movie).toMatchObject({
        id: expect.any(Number),
        title: expect.any(String),
        poster_path: expect.any(String),
        release_date: expect.any(String),
        vote_average: expect.any(Number),
      });
    });
  });

  describe('Query Parameters', () => {
    it('handles default parameters (page=1, lang=en)', async () => {
      const response = await request(app).get('/movies');

      expect(response.status).toBe(200);
      expect(response.body.page).toBe(1);
    });

    it('accepts page parameter', async () => {
      const response = await request(app)
        .get('/movies')
        .query({ page: 2 });

      expect(response.status).toBe(200);
      expect(response.body.page).toBe(2);
    });

    it('accepts search parameter', async () => {
      const response = await request(app)
        .get('/movies')
        .query({ search: TEST_SEARCH_QUERY });

      expect(response.status).toBe(200);
      expect(response.body.results[0].title).toContain(TEST_SEARCH_QUERY);
    });

    it('accepts language parameter', async () => {
      const response = await request(app)
        .get('/movies')
        .query({ lang: 'ru' });

      expect(response.status).toBe(200);
      expect(response.body.results).toBeDefined();
    });

    it('handles multiple parameters together', async () => {
      const response = await request(app)
        .get('/movies')
        .query({ page: 2, search: 'test', lang: 'en' });

      expect(response.status).toBe(200);
      expect(response.body.page).toBe(2);
    });
  });

  describe('Parameter Type Coercion', () => {
    it('coerces string page to number', async () => {
      const response = await request(app)
        .get('/movies')
        .query({ page: '3' });

      expect(response.status).toBe(200);
      expect(response.body.page).toBe(3);
    });

    it('handles empty search string', async () => {
      const response = await request(app)
        .get('/movies')
        .query({ search: '' });

      expect(response.status).toBe(200);
      // Empty search should use discover endpoint (IDs < 200)
      expect(response.body.results[0].id).toBeLessThan(SEARCH_START_ID);
    });
  });
});
