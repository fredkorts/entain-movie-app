import axios from "axios";
import type { TMDBMovieDetail, MovieDetail } from "../types/tmdb.js";
import {
  TMDB_BASE_URL,
  TMDB_REQUEST_TIMEOUT,
  MAX_BACKDROPS,
  MAX_POSTERS,
  MAX_REVIEWS,
  LANGUAGE_MAP,
  DEFAULT_LANGUAGE,
  RESULTS_PER_PAGE,
  TMDB_RESULTS_PER_PAGE
} from "../config/constants.js";
import { logger } from "../utils/logger.js";

const TMDB = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: TMDB_REQUEST_TIMEOUT
});

function mapLanguage(lang?: string): string {
  const l = (lang || "en").split("-")[0].toLowerCase();
  return LANGUAGE_MAP[l] || DEFAULT_LANGUAGE;
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

/**
 * Fetches comprehensive movie details from TMDB including cast, crew, videos, reviews, and images.
 * Automatically falls back to English if the requested language has no overview.
 * 
 * @param id - Movie ID
 * @param lang - Language code (e.g., 'en', 'et', 'ru')
 * @returns Normalized movie detail object
 */
export async function fetchMovieDetailWithFallback(id: string, lang?: string): Promise<MovieDetail> {
  const language = mapLanguage(lang);
  const apiKey = authParams().api_key;
  
  // Build params for TMDB API
  const params = new URLSearchParams({
    api_key: apiKey,
    language,
    include_image_language: `${language.split("-")[0]},en,null`,
    include_video_language: `${language.split("-")[0]},en`,
    append_to_response: "credits,videos,reviews,images"
  });

  // Fetch movie details with all append_to_response data
  const { data } = await TMDB.get<TMDBMovieDetail>(`/movie/${id}?${params.toString()}`);

  // If overview is empty and language isn't English, fetch English fallback
  let finalOverview = data.overview ?? "";
  if (!finalOverview && language !== "en-US") {
    try {
      const fallbackResponse = await TMDB.get(`/movie/${id}`, {
        params: {
          api_key: apiKey,
          language: "en-US"
        }
      });
      finalOverview = fallbackResponse.data.overview ?? "";
    } catch (fallbackError) {
      // Silently fail - keep empty overview
      logger.error("Failed to fetch English fallback:", fallbackError);
    }
  }

  // Normalize the response
  return {
    id: data.id,
    title: data.title,
    overview: finalOverview,
    poster_path: data.poster_path ?? null,
    backdrop_path: data.backdrop_path ?? null,
    release_date: data.release_date ?? "",
    runtime: data.runtime ?? 0,
    vote_average: data.vote_average ?? 0,
    genres: data.genres ?? [],
    cast: (data.credits?.cast ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile_path: c.profile_path,
      order: c.order
    })),
    crew: (data.credits?.crew ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      job: c.job,
      department: c.department,
      profile_path: c.profile_path
    })),
    videos: (data.videos?.results ?? []).map((v) => ({
      id: v.id,
      key: v.key,
      name: v.name,
      site: v.site,
      type: v.type,
      official: v.official
    })),
    reviews: (data.reviews?.results ?? []).slice(0, MAX_REVIEWS).map((r) => ({
      id: r.id,
      author: r.author,
      content: r.content,
      created_at: r.created_at,
      author_details: r.author_details
    })),
    images: {
      backdrops: (data.images?.backdrops ?? []).slice(0, MAX_BACKDROPS).map((img) => ({
        file_path: img.file_path,
        width: img.width,
        height: img.height,
        vote_average: img.vote_average
      })),
      posters: (data.images?.posters ?? []).slice(0, MAX_POSTERS).map((img) => ({
        file_path: img.file_path,
        width: img.width,
        height: img.height,
        vote_average: img.vote_average
      }))
    }
  };
}