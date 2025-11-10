import i18n from "../../../i18n";
import { getJSON } from "../../../lib/api";
import type { MovieDetail, MoviesResponse, MovieSummary } from "./types";

function shortLang() {
  return (i18n.language || "en").split("-")[0];
}

export async function fetchMovies(params: { page?: number; search?: string }) {
  const page = params.page ?? 1;
  const search = (params.search ?? "").trim();
  const q = new URLSearchParams();
  q.set("page", String(page));
  if (search) q.set("search", search);
  q.set("lang", shortLang());
  return getJSON<MoviesResponse>(`/movies?${q.toString()}`);
}

export async function fetchMovieById(id: number | string): Promise<MovieSummary & Record<string, unknown>> {
  const q = new URLSearchParams();
  q.set("lang", shortLang());
  return getJSON(`/movies/${id}?${q.toString()}`);
}

export async function fetchMovieDetail(id: number | string) {
  const q = new URLSearchParams();
  q.set("lang", shortLang()); 
  return getJSON<MovieDetail>(`/movies/${id}?${q.toString()}`);
}
