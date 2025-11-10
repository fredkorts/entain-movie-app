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
