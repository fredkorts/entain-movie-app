/**
 * Type definitions for TMDB API responses
 */

export interface TMDBCastMember {
  adult: boolean;
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number | null;
  id: number;
  known_for_department: string;
  name: string;
  order: number;
  original_name: string;
  popularity: number;
  profile_path: string | null;
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TMDBVideo {
  id: string;
  iso_3166_1: string;
  iso_639_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TMDBReview {
  id: string;
  author: string;
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
  author_details: {
    name?: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
}

export interface TMDBImage {
  file_path: string;
  width: number;
  height: number;
  vote_average: number;
}

/**
 * Normalized types - what we send to frontend (subset of TMDB fields)
 */
export interface NormalizedCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface NormalizedCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface NormalizedVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface NormalizedReview {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: {
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
}

export interface TMDBMovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: Array<{ id: number; name: string }>;
  credits?: {
    cast: TMDBCastMember[];
    crew: TMDBCrewMember[];
  };
  videos?: {
    results: TMDBVideo[];
  };
  reviews?: {
    results: TMDBReview[];
  };
  images?: {
    backdrops: TMDBImage[];
    posters: TMDBImage[];
  };
}

/**
 * Normalized movie detail response (what we send to frontend)
 */
export interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: Array<{ id: number; name: string }>;
  cast: NormalizedCastMember[];
  crew: NormalizedCrewMember[];
  videos: NormalizedVideo[];
  reviews: NormalizedReview[];
  images: {
    backdrops: TMDBImage[];
    posters: TMDBImage[];
  };
}
