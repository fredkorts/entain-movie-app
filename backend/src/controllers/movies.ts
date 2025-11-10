import type { RequestHandler } from "express";
import { fetchMovies, fetchMovieById } from "../services/tmdb";

export const listMovies: RequestHandler = async (req, res, next) => {
  try {
    const q = req.query as Record<string, unknown>;
    const page = Number(q.page ?? 1);
    const search = String(q.search ?? "");
    const lang = String(q.lang ?? "en");
    const data = await fetchMovies({ page, search, lang });
    res.json(data);
  } catch (err) {
    next(err as any);
  }
};

export const getMovie: RequestHandler = async (req, res, next) => {
  try {
    const { id } = (req.params as Record<string, string>);
    const q = req.query as Record<string, unknown>;
    const lang = String(q.lang ?? "en");
    const data = await fetchMovieById(id, lang);
    res.json(data);
  } catch (err) {
    next(err as any);
  }
};
