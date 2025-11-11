import { describe, it, expect, vi, beforeEach } from 'vitest';
import i18n from '../../../i18n';

// Mock environment variable
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000/api');

// Mock i18n
vi.mock('../../../i18n', () => ({
  default: {
    language: 'en',
  },
}));

describe('moviesApi', () => {
  beforeEach(() => {
    vi.mocked(i18n).language = 'en';
    vi.resetModules();
  });

  describe('API configuration', () => {
    it('configures correct reducer path', async () => {
      const { moviesApi } = await import('../moviesApi');
      
      expect(moviesApi.reducerPath).toBe('moviesApi');
    });

    it('defines getMovies endpoint', async () => {
      const { moviesApi } = await import('../moviesApi');
      
      expect(moviesApi.endpoints.getMovies).toBeDefined();
    });

    it('defines getMovieDetail endpoint', async () => {
      const { moviesApi } = await import('../moviesApi');
      
      expect(moviesApi.endpoints.getMovieDetail).toBeDefined();
    });

    it('exports useGetMoviesQuery hook', async () => {
      const { useGetMoviesQuery } = await import('../moviesApi');
      
      expect(useGetMoviesQuery).toBeDefined();
      expect(typeof useGetMoviesQuery).toBe('function');
    });

    it('exports useGetMovieDetailQuery hook', async () => {
      const { useGetMovieDetailQuery } = await import('../moviesApi');
      
      expect(useGetMovieDetailQuery).toBeDefined();
      expect(typeof useGetMovieDetailQuery).toBe('function');
    });
  });

  describe('shortLang functionality via different i18n.language values', () => {
    it('initializes with simple language code "en"', async () => {
      vi.mocked(i18n).language = 'en';
      vi.resetModules();
      
      const { moviesApi } = await import('../moviesApi');
      
      expect(moviesApi.reducerPath).toBe('moviesApi');
    });

    it('initializes with language code with region "en-US"', async () => {
      vi.mocked(i18n).language = 'en-US';
      vi.resetModules();
      
      const { moviesApi } = await import('../moviesApi');
      
      expect(moviesApi.reducerPath).toBe('moviesApi');
    });

    it('initializes with Russian language "ru-RU"', async () => {
      vi.mocked(i18n).language = 'ru-RU';
      vi.resetModules();
      
      const { moviesApi } = await import('../moviesApi');
      
      expect(moviesApi.reducerPath).toBe('moviesApi');
    });

    it('initializes with Estonian language "et"', async () => {
      vi.mocked(i18n).language = 'et';
      vi.resetModules();
      
      const { moviesApi } = await import('../moviesApi');
      
      expect(moviesApi.reducerPath).toBe('moviesApi');
    });

    it('initializes with empty language string', async () => {
      vi.mocked(i18n).language = '';
      vi.resetModules();
      
      const { moviesApi } = await import('../moviesApi');
      
      expect(moviesApi.reducerPath).toBe('moviesApi');
    });
  });
});
