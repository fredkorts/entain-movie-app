import axios from "axios";

const TMDB = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 10_000
});

function mapLanguage(lang?: string): string {
  const l = (lang || "en").split("-")[0].toLowerCase();
  // Map known languages to TMDB BCP-47 tags
  if (l === "ru") return "ru-RU";
  if (l === "en") return "en-US";
  // TMDB doesn't really have Estonian; fall back to English
  return "en-US";
}


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

export async function fetchMovies(opts: { page?: number; search?: string; lang?: string }) {
  const page = opts.page ?? 1;
  const search = (opts.search ?? "").trim();
  const language = mapLanguage(opts.lang);

  const params: Record<string, string | number> = { ...authParams(), page, language };

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

export async function fetchMovieById(id: string, lang?: string) {
  const language = mapLanguage(lang);
  const { data } = await TMDB.get(`/movie/${id}`, { params: { ...authParams(), language } });
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