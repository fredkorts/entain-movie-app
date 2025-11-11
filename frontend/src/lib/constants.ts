// =============================================================================
// APPLICATION CONSTANTS
// =============================================================================
// This file contains all reusable constants to follow DRY principles
// and centralize configuration values.

// =============================================================================
// API & EXTERNAL SERVICES
// =============================================================================

/** TMDB (The Movie Database) image base URL */
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

/** YouTube video watch URL base */
export const YOUTUBE_WATCH_URL = 'https://www.youtube.com/watch?v=';

/** YouTube thumbnail image base URL */
export const YOUTUBE_THUMBNAIL_BASE_URL = 'https://img.youtube.com/vi';

// =============================================================================
// IMAGE SIZES
// =============================================================================

/** Standard TMDB image sizes */
export const TMDB_IMAGE_SIZES = {
  /** Small size for thumbnails and avatars (185px) */
  SMALL: 'w185',
  /** Medium size for movie cards (342px) */
  MEDIUM: 'w342', 
  /** Large size for detail views (500px) */
  LARGE: 'w500',
  /** Extra large for hero banners (780px) */
  XLARGE: 'w780',
  /** Original size */
  ORIGINAL: 'original'
} as const;

// =============================================================================
// PAGINATION & UI
// =============================================================================

/** Number of results per page for movie listings */
export const MOVIES_PAGE_SIZE = 10;

/** Default debounce delay for search inputs (in milliseconds) */
export const SEARCH_DEBOUNCE_DELAY = 350;

/** Default debounce delay for generic inputs (in milliseconds) */
export const DEFAULT_DEBOUNCE_DELAY = 300;

// =============================================================================
// LOCALIZATION
// =============================================================================

/** Default language code */
export const DEFAULT_LANGUAGE = 'en';

/** Supported language codes */
export const SUPPORTED_LANGUAGES = {
  ENGLISH: 'en',
  ESTONIAN: 'et', 
  RUSSIAN: 'ru'
} as const;

// =============================================================================
// BROWSER & NAVIGATION
// =============================================================================

/** Target for opening external links */
export const EXTERNAL_LINK_TARGET = '_blank';

/** YouTube thumbnail quality for video previews */
export const YOUTUBE_THUMBNAIL_QUALITY = 'maxresdefault';

// =============================================================================
// PLACEHOLDER VALUES
// =============================================================================

/** Default placeholder image path */
export const PLACEHOLDER_IMAGE_PATH = '/placeholder.svg';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Generate TMDB image URL with specified size
 * @param path - Image path from TMDB API
 * @param size - Image size (default: MEDIUM)
 * @returns Complete image URL or empty string if no path
 */
export const getTmdbImageUrl = (
  path?: string | null, 
  size: string = TMDB_IMAGE_SIZES.MEDIUM
): string => {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : '';
};

/**
 * Generate YouTube video URL
 * @param videoKey - YouTube video key/ID
 * @returns Complete YouTube video URL
 */
export const getYouTubeVideoUrl = (videoKey: string): string => {
  return `${YOUTUBE_WATCH_URL}${videoKey}`;
};

/**
 * Generate YouTube thumbnail URL
 * @param videoKey - YouTube video key/ID
 * @param quality - Thumbnail quality (default: maxresdefault)
 * @returns Complete YouTube thumbnail URL
 */
export const getYouTubeThumbnailUrl = (
  videoKey: string, 
  quality: string = YOUTUBE_THUMBNAIL_QUALITY
): string => {
  return `${YOUTUBE_THUMBNAIL_BASE_URL}/${videoKey}/${quality}.jpg`;
};