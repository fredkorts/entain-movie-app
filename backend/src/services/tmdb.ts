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
  // Validate and parse page parameter
  let page = 1;
  if (opts.page !== undefined) {
    const parsedPage = Number(opts.page);
    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
      throw new RangeError(`Invalid page parameter: ${opts.page}. Page must be a positive integer.`);
    }
    page = parsedPage;
  }
  
  const search = (opts.search ?? "").trim();
  const language = mapLanguage(opts.lang);
  
  // We want 10 results per page, but TMDB gives us 20
  const RESULTS_PER_PAGE = 10;
  const TMDB_RESULTS_PER_PAGE = 20;
  
  // Calculate which TMDB page to fetch and the offset within that page
  const tmdbPage = Math.ceil((page * RESULTS_PER_PAGE) / TMDB_RESULTS_PER_PAGE);
  const offsetInTmdbPage = ((page - 1) * RESULTS_PER_PAGE) % TMDB_RESULTS_PER_PAGE;

  const params: Record<string, string | number> = { ...authParams(), page: tmdbPage, language };

  let path = "/discover/movie";
  if (search) {
    path = "/search/movie";
    params.query = search;
    params.include_adult = "false";
  }

  const { data } = await TMDB.get(path, { params });
  
  // Slice the TMDB results to get our desired page size
  const allResults = (data.results ?? []).map((m: any) => ({
    id: m.id,
    title: m.title,
    poster_path: m.poster_path ?? null,
    release_date: m.release_date ?? "",
    vote_average: m.vote_average ?? 0
  }));
  
  const results = allResults.slice(offsetInTmdbPage, offsetInTmdbPage + RESULTS_PER_PAGE);
  
  // Recalculate pagination based on our page size
  const totalResults = data.total_results ?? 0;
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  return {
    results,
    page,
    total_pages: totalPages,
    total_results: totalResults
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