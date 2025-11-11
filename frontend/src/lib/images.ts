import { getTmdbImageUrl, TMDB_IMAGE_SIZES } from './constants';

export const tmdbImg = (path?: string | null, size: string = TMDB_IMAGE_SIZES.SMALL) =>
  getTmdbImageUrl(path, size);
