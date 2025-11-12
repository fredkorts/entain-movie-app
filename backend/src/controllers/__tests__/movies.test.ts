import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '../../index';
import { setupApiKeyForTest, cleanupAfterTest } from '../../test/testUtils';
import { VALID_MOVIE_ID, NONEXISTENT_MOVIE_ID, MAX_BACKDROPS, MAX_POSTERS, MAX_REVIEWS } from '../../test/constants';

describe('Movie Detail Controller - Critical Tests', () => {
  let cleanup: ReturnType<typeof setupApiKeyForTest>;

  beforeEach(() => {
    cleanup = setupApiKeyForTest();
  });

  afterEach(() => {
    cleanupAfterTest(cleanup);
  });

  describe('Successful Response', () => {
    it('returns normalized movie data with all required fields', async () => {
      const response = await request(app)
        .get(`/movies/${VALID_MOVIE_ID}`)
        .query({ lang: 'en' });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: VALID_MOVIE_ID,
        title: expect.any(String),
        overview: expect.any(String),
        runtime: expect.any(Number),
        genres: expect.any(Array),
        cast: expect.any(Array),
        crew: expect.any(Array),
        videos: expect.any(Array),
        images: expect.any(Object),
        reviews: expect.any(Array),
      });
    });

    it(`limits backdrops to ${MAX_BACKDROPS} items`, async () => {
      const response = await request(app)
        .get(`/movies/${VALID_MOVIE_ID}`)
        .query({ lang: 'en' });

      // MSW returns 15 backdrops, controller slices to MAX_BACKDROPS
      expect(response.body.images.backdrops).toHaveLength(MAX_BACKDROPS);
    });

    it(`limits posters to ${MAX_POSTERS} items`, async () => {
      const response = await request(app)
        .get(`/movies/${VALID_MOVIE_ID}`)
        .query({ lang: 'en' });

      // MSW returns 10 posters, controller slices to MAX_POSTERS
      expect(response.body.images.posters).toHaveLength(MAX_POSTERS);
    });

    it(`limits reviews to ${MAX_REVIEWS} items`, async () => {
      const response = await request(app)
        .get(`/movies/${VALID_MOVIE_ID}`)
        .query({ lang: 'en' });

      // MSW returns 7 reviews, controller slices to MAX_REVIEWS
      expect(response.body.reviews).toHaveLength(MAX_REVIEWS);
    });
  });

  describe('Error Handling', () => {
    it('returns 404 for non-existent movie', async () => {
      const response = await request(app)
        .get(`/movies/${NONEXISTENT_MOVIE_ID}`)
        .query({ lang: 'en' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.status).toBe(404);
    });

    it('rejects non-numeric movie IDs with 404', async () => {
      const response = await request(app)
        .get('/movies/abc')
        .query({ lang: 'en' });

      expect(response.status).toBe(404);
    });

    it('handles missing language parameter with default', async () => {
      const response = await request(app)
        .get(`/movies/${VALID_MOVIE_ID}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(VALID_MOVIE_ID);
    });
  });

  describe('Data Transformation', () => {
    it('includes cast with required fields', async () => {
      const response = await request(app)
        .get(`/movies/${VALID_MOVIE_ID}`)
        .query({ lang: 'en' });

      expect(response.body.cast.length).toBeGreaterThan(0);
      expect(response.body.cast[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        character: expect.any(String),
        order: expect.any(Number),
      });
    });

    it('includes crew with required fields', async () => {
      const response = await request(app)
        .get(`/movies/${VALID_MOVIE_ID}`)
        .query({ lang: 'en' });

      expect(response.body.crew.length).toBeGreaterThan(0);
      expect(response.body.crew[0]).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
        job: expect.any(String),
        department: expect.any(String),
      });
    });

    it('includes videos with YouTube data', async () => {
      const response = await request(app)
        .get(`/movies/${VALID_MOVIE_ID}`)
        .query({ lang: 'en' });

      expect(response.body.videos.length).toBeGreaterThan(0);
      expect(response.body.videos[0]).toMatchObject({
        id: expect.any(String),
        key: expect.any(String),
        name: expect.any(String),
        site: expect.any(String),
        type: expect.any(String),
      });
    });
  });
});
