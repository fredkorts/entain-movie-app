import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { MovieDetail, MoviesResponse } from '../../features/movies/api/types';
import i18n from '../../i18n';

function shortLang() {
  return (i18n.language || "en").split("-")[0];
}

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL as string,
  }),
  tagTypes: ['Movie', 'MovieList'],
  endpoints: (builder) => ({
    getMovies: builder.query<MoviesResponse, { page?: number; search?: string; lang?: string }>({
      query: ({ page = 1, search = '', lang }) => {
        const params = new URLSearchParams();
        params.set('page', String(page));
        if (search.trim()) params.set('search', search.trim());
        params.set('lang', lang || shortLang());
        return `/movies?${params.toString()}`;
      },
      providesTags: (result, _error, { page, search, lang }) => [
        { type: 'MovieList', id: `${page}-${search || ''}-${lang || shortLang()}` },
        ...(result?.results?.map(({ id }) => ({ type: 'Movie' as const, id: `${id}-${lang || shortLang()}` })) ?? []),
      ],
    }),
    getMovieDetail: builder.query<MovieDetail, { id: string | number; lang?: string }>({
      query: ({ id, lang }) => {
        const params = new URLSearchParams();
        params.set('lang', lang || shortLang());
        return `/movies/${id}?${params.toString()}`;
      },
      providesTags: (_result, _error, { id, lang }) => [{ type: 'Movie', id: `${id}-${lang || shortLang()}` }],
    }),
  }),
});

export const { useGetMoviesQuery, useGetMovieDetailQuery } = moviesApi;