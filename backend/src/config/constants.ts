/**
 * Application-wide constants
 * 
 * This file contains all constant values used throughout the backend.
 * Centralizing constants improves maintainability and reduces duplication.
 */

/**
 * TMDB API Configuration
 */
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_REQUEST_TIMEOUT = 10_000; // 10 seconds

/**
 * Data Limits
 * These limits control how much data we fetch and return from TMDB
 */
export const MAX_BACKDROPS = 12;
export const MAX_POSTERS = 8;
export const MAX_REVIEWS = 5;

/**
 * Language Mappings
 * Maps our language codes to TMDB BCP-47 locale tags
 */
export const LANGUAGE_MAP: Record<string, string> = {
  ru: "ru-RU",
  en: "en-US",
  et: "en-US", // Estonian falls back to English (TMDB limitation)
};

export const DEFAULT_LANGUAGE = "en-US";

/**
 * Pagination
 */
export const RESULTS_PER_PAGE = 10;
export const TMDB_RESULTS_PER_PAGE = 20;

/**
 * Server Configuration
 */
export const DEFAULT_PORT = 3001;
