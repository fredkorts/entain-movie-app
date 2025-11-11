export const tmdbImg = (path?: string | null, size: string = 'w185') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
