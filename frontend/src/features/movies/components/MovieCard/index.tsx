import { Card } from "antd";
import { Link } from "react-router-dom";
import { memo, useMemo } from "react";
import type { MovieSummary } from "../../api/types";
import { getTmdbImageUrl, TMDB_IMAGE_SIZES, PLACEHOLDER_IMAGE_PATH } from "../../../../lib/constants";
import styles from "./MovieCard.module.scss";

const poster = (p: string | null, w: string = TMDB_IMAGE_SIZES.MEDIUM) => getTmdbImageUrl(p, w) || "";

function MovieCard({ movie }: { movie: MovieSummary }) {
  const year = useMemo(() => 
    movie.release_date?.slice(0, 4) ?? "—", 
    [movie.release_date]
  );
  
  const posterUrl = useMemo(() => 
    poster(movie.poster_path) || PLACEHOLDER_IMAGE_PATH,
    [movie.poster_path]
  );
  
  return (
    <Link to={`/movie/${movie.id}`} aria-label={`Open ${movie.title}`} className={styles.link} data-testid="movie-card">
      <Card hoverable className={styles.card} data-testid="movie-card-content">
        <img
          src={posterUrl}
          alt={movie.title}
          className={styles.posterImage}
          loading="lazy"
          data-testid="movie-card-poster"
        />
        <div className={styles.content}>
          <div className={styles.title} data-testid="movie-card-title">{movie.title}</div>
          <div className={styles.year} data-testid="movie-card-year">{year}</div>
        </div>
      </Card>
    </Link>
  );
}

export default memo(MovieCard);
