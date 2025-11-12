import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../index';
import { setupApiKeyForTest, cleanupAfterTest } from '../../test/testUtils';
import { VALID_MOVIE_ID, NONEXISTENT_MOVIE_ID } from '../../test/constants';

describe('Routes - Critical Tests', () => {
  let cleanup: ReturnType<typeof setupApiKeyForTest>;

  beforeEach(() => {
    cleanup = setupApiKeyForTest();
  });

  afterEach(() => {
    cleanupAfterTest(cleanup);
  });

  describe('Movies List Route', () => {
    it('GET /movies calls listMovies controller', async () => {
      const response = await request(app).get('/movies');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('results');
    });

    it('GET /api/movies works in local dev mode', async () => {
      const response = await request(app).get('/api/movies');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('results');
    });
  });

  describe('Movie Detail Route', () => {
    it('GET /movies/:id with numeric ID calls getMovie controller', async () => {
      const response = await request(app).get(`/movies/${VALID_MOVIE_ID}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(VALID_MOVIE_ID);
    });

    it('GET /api/movies/:id works in local dev mode', async () => {
      const response = await request(app).get(`/api/movies/${VALID_MOVIE_ID}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(VALID_MOVIE_ID);
    });
  });

  describe('Route Validation', () => {
    it('rejects non-numeric movie ID', async () => {
      const response = await request(app).get('/movies/abc');

      expect(response.status).toBe(404);
    });

    it('rejects movie ID with special characters', async () => {
      const response = await request(app).get('/movies/123-456');

      expect(response.status).toBe(404);
    });

    it('accepts large numeric IDs', async () => {
      const response = await request(app).get(`/movies/${NONEXISTENT_MOVIE_ID}`);

      // This will return 404 from TMDB mock, not route rejection
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('route regex only matches pure digits', async () => {
      const alphanumeric = await request(app).get('/movies/123abc');
      const withDash = await request(app).get('/movies/123-456');
      const withDot = await request(app).get('/movies/123.456');

      expect(alphanumeric.status).toBe(404);
      expect(withDash.status).toBe(404);
      expect(withDot.status).toBe(404);
    });
  });

  describe('CORS and Headers', () => {
    it('includes CORS headers in response', async () => {
      const response = await request(app).get('/movies');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Health Endpoint', () => {
    it('GET /health returns 200', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        ok: true,
        service: 'backend',
      });
    });
  });

  describe('404 Handler', () => {
    it('returns 404 for unknown routes', async () => {
      const response = await request(app).get('/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toBe('Not found');
    });

    it('includes requested path in 404 response', async () => {
      const response = await request(app).get('/unknown/path');

      expect(response.status).toBe(404);
      expect(response.body.error.path).toBe('/unknown/path');
    });
  });
});
