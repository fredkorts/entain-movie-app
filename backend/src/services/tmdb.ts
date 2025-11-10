import axios from "axios";

const TMDB = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 10_000
});

function authParams() {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    const err = new Error("TMDB_API_KEY missing");
    // @ts-ignore
    err.status = 500;
    throw err;
  }
  return { api_key: apiKey };
}

export async function fetchMovies(opts: { page?: number; search?: string }) {
  const page = opts.page ?? 1;
  const search = (opts.search ?? "").trim();

  const params: Record<string, string | number> = { ...authParams(), page };

  let path = "/discover/movie";
  if (search) {
    path = "/search/movie";
    params.query = search;
    params.include_adult = "false";
  }

  const { data } = await TMDB.get(path, { params });

  return {
    results: (data.results ?? []).map((m: any) => ({
      id: m.id,
      title: m.title,
      poster_path: m.poster_path ?? null,
      release_date: m.release_date ?? "",
      vote_average: m.vote_average ?? 0
    })),
    page: data.page ?? page,
    total_pages: data.total_pages ?? 1,
    total_results: data.total_results ?? 0
  };
}

export async function fetchMovieById(id: string) {
  const { data } = await TMDB.get(`/movie/${id}`, { params: authParams() });
  return {
    id: data.id,
    title: data.title,
    overview: data.overview ?? "",
    poster_path: data.poster_path ?? null,
    backdrop_path: data.backdrop_path ?? null,
    release_date: data.release_date ?? "",
    runtime: data.runtime ?? 0,
    vote_average: data.vote_average ?? 0,
    genres: data.genres ?? []
  };
}
