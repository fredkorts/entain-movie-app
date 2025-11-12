import { Card } from "antd";
import { Link } from "react-router-dom";
import { memo, useMemo, useState } from "react";
import { VideoCameraOutlined } from "@ant-design/icons";
import type { MovieSummary } from "../../api/types";
import { getTmdbImageUrl, TMDB_IMAGE_SIZES } from "../../../../lib/constants";
import styles from "./MovieCard.module.scss";

const poster = (p: string | null, w: string = TMDB_IMAGE_SIZES.MEDIUM) => getTmdbImageUrl(p, w) || "";

function MovieCard({ movie }: { movie: MovieSummary }) {
  const [imageError, setImageError] = useState(false);
  
  const year = useMemo(() => 
    movie.release_date?.slice(0, 4) ?? "—", 
    [movie.release_date]
  );
  
  const posterUrl = useMemo(() => 
    poster(movie.poster_path),
    [movie.poster_path]
  );
  
  const hasPoster = posterUrl && !imageError;
  
  return (
    <Link to={`/movie/${movie.id}`} aria-label={`Open ${movie.title}`} className={styles.link} data-testid="movie-card">
      <Card hoverable className={styles.card} data-testid="movie-card-content">
        {hasPoster ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className={styles.posterImage}
            loading="lazy"
            onError={() => setImageError(true)}
            data-testid="movie-card-poster"
          />
        ) : (
          <div className={styles.fallbackContainer} data-testid="movie-card-fallback">
            <VideoCameraOutlined className={styles.fallbackIcon} />
            <div className={styles.fallbackTitle}>{movie.title}</div>
          </div>
        )}
        <div className={styles.content}>
          <div className={styles.title} data-testid="movie-card-title">{movie.title}</div>
          <div className={styles.year} data-testid="movie-card-year">{year}</div>
        </div>
      </Card>
    </Link>
  );
}

export default memo(MovieCard);
