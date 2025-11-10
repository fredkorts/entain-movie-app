import { Request, Response, NextFunction } from "express";
import { fetchMovies, fetchMovieById } from "../services/tmdb";

export async function listMovies(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page ?? 1);
    const search = String(req.query.search ?? "");
    const lang = String(req.query.lang ?? "en");
    const data = await fetchMovies({ page, search, lang });
    res.json(data);
  } catch (err) { next(err); }
}

export async function getMovie(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const lang = String(req.query.lang ?? "en");
    const data = await fetchMovieById(id, lang);
    res.json(data);
  } catch (err) { next(err); }
}

