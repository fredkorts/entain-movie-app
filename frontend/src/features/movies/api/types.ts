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
};

