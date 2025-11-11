import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { moviesApi, useGetMoviesQuery, useGetMovieDetailQuery } from '../moviesApi';
import type { ReactNode } from 'react';

// Helper to create a fresh store for each test
function createTestStore() {
  return configureStore({
    reducer: {
      [moviesApi.reducerPath]: moviesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(moviesApi.middleware),
  });
}

// Wrapper component that provides Redux store
function createWrapper(store: ReturnType<typeof createTestStore>) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
}

describe('moviesApi Integration Tests', () => {
  describe('useGetMoviesQuery', () => {
    it('fetches movies with parameters and validates structure', async () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);

      const { result } = renderHook(() => useGetMoviesQuery({ page: 2, search: 'action', lang: 'ru' }), {
        wrapper,
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify response structure
      expect(result.current.data).toBeDefined();
      expect(result.current.data?.results).toBeInstanceOf(Array);
      expect(result.current.data?.page).toBe(2);
      expect(result.current.data?.total_pages).toBeGreaterThan(0);

      // Verify movie structure
      const firstMovie = result.current.data?.results[0];
      expect(firstMovie).toHaveProperty('id');
      expect(firstMovie).toHaveProperty('title');
      expect(firstMovie).toHaveProperty('release_date');
      expect(firstMovie).toHaveProperty('vote_average');
      expect(firstMovie).toHaveProperty('poster_path');
    });

    it('caches results for same parameters', async () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);

      const { result: result1 } = renderHook(
        () => useGetMoviesQuery({ page: 1, search: '' }),
        { wrapper }
      );

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const firstData = result1.current.data;

      // Second query with same parameters should use cache
      const { result: result2 } = renderHook(
        () => useGetMoviesQuery({ page: 1, search: '' }),
        { wrapper }
      );

      expect(result2.current.data).toBe(firstData);
      expect(result2.current.isSuccess).toBe(true);
    });
  });

  describe('useGetMovieDetailQuery', () => {
    it('fetches complete movie detail with all nested data', async () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);

      const { result } = renderHook(() => useGetMovieDetailQuery({ id: 1, lang: 'et' }), {
        wrapper,
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify complete movie detail structure
      expect(result.current.data).toBeDefined();
      expect(result.current.data?.id).toBe(1);
      expect(result.current.data).toHaveProperty('title');
      expect(result.current.data).toHaveProperty('overview');
      expect(result.current.data).toHaveProperty('release_date');
      expect(result.current.data).toHaveProperty('runtime');
      expect(result.current.data).toHaveProperty('genres');
      expect(result.current.data).toHaveProperty('cast');
      expect(result.current.data).toHaveProperty('crew');
      expect(result.current.data).toHaveProperty('videos');
      expect(result.current.data).toHaveProperty('images');
      expect(result.current.data).toHaveProperty('reviews');

      // Verify cast structure
      const firstCastMember = result.current.data?.cast[0];
      expect(firstCastMember).toHaveProperty('id');
      expect(firstCastMember).toHaveProperty('name');
      expect(firstCastMember).toHaveProperty('character');

      // Verify crew structure
      const firstCrewMember = result.current.data?.crew[0];
      expect(firstCrewMember).toHaveProperty('id');
      expect(firstCrewMember).toHaveProperty('name');
      expect(firstCrewMember).toHaveProperty('job');
    });

    it('handles string ID format', async () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);

      const { result } = renderHook(() => useGetMovieDetailQuery({ id: '2' }), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.id).toBe(2);
    });

    it('caches movie details', async () => {
      const store = createTestStore();
      const wrapper = createWrapper(store);

      const { result: result1 } = renderHook(() => useGetMovieDetailQuery({ id: 1 }), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const firstData = result1.current.data;

      // Second query should use cache
      const { result: result2 } = renderHook(() => useGetMovieDetailQuery({ id: 1 }), {
        wrapper,
      });

      expect(result2.current.data).toBe(firstData);
    });
  });
});
