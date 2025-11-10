import { getJSON } from "../../../lib/api";
import type { MovieDetail, MoviesResponse, MovieSummary } from "./types";

export async function fetchMovies(params: { page?: number; search?: string }): Promise<MoviesResponse> {
  const page = params.page ?? 1;
  const search = (params.search ?? "").trim();
  const q = new URLSearchParams();
  q.set("page", String(page));
  if (search) q.set("search", search);
  return getJSON<MoviesResponse>(`/movies?${q.toString()}`);
}

export async function fetchMovieById(id: number | string): Promise<MovieSummary & Record<string, unknown>> {
  return getJSON(`/movies/${id}`);
}

export async function fetchMovieDetail(id: number | string): Promise<MovieDetail> {
  return getJSON<MovieDetail>(`/movies/${id}`);
}
