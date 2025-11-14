import type { RequestHandler } from 'express';
import { fetchMovies, fetchMovieDetailWithFallback } from '../services/tmdb.js';

export const listMovies: RequestHandler = async (req, res, next) => {
  try {
    const q = req.query as Record<string, unknown>;
    const page = Number(q.page ?? 1);
    const search = String(q.search ?? '');
    const lang = String(q.lang ?? 'en');
    const data = await fetchMovies({ page, search, lang });
    res.json(data);
  } catch (err) {
    next(err as any);
  }
};

/**
 * Get a specific movie by ID with full details (cast, crew, videos, reviews, images)
 * Automatically falls back to English overview if the requested language has none.
 */
export const getMovie: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lang } = req.query as { lang?: string };

    const movieDetail = await fetchMovieDetailWithFallback(id, lang);
    res.json(movieDetail);
  } catch (e) {
    next(e);
  }
};
