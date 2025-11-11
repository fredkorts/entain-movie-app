export type MovieSummary = {
  id: number;
  title: string;
  release_date: string;
  vote_average: number;
  poster_path: string | null;
};

export type MoviesResponse = {
  results: MovieSummary[];
  page: number;
  total_pages: number;
  total_results: number;
};

export type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
};

export type CrewMember = {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
};

export type Video = {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
};

export type Review = {
  id: string;
  author: string;
  content: string;
  created_at: string;
  url: string;
};

export type MovieImage = {
  file_path: string;
  width: number;
  height: number;
  vote_average: number;
};

export type MovieDetail = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  runtime: number;
  vote_average: number;
  genres: { id: number; name: string }[];
  homepage?: string;
  status?: string;
  tagline?: string;
  // Enhanced data from backend
  cast: CastMember[];
  crew: CrewMember[];
  videos: Video[];
  images: {
    backdrops: MovieImage[];
    posters: MovieImage[];
  };
  reviews: Review[];
};

