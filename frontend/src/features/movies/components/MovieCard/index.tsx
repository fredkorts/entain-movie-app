import { Card } from "antd";
import { Link } from "react-router-dom";
import type { MovieSummary } from "../../api/types";
import { getTmdbImageUrl, TMDB_IMAGE_SIZES, PLACEHOLDER_IMAGE_PATH } from "../../../../lib/constants";
import styles from "./MovieCard.module.css";

const poster = (p: string | null, w: string = TMDB_IMAGE_SIZES.MEDIUM) => getTmdbImageUrl(p, w) || "";

export default function MovieCard({ movie }: { movie: MovieSummary }) {
  const year = movie.release_date?.slice(0, 4) ?? "—";
  
  return (
    <Link to={`/movie/${movie.id}`} aria-label={`Open ${movie.title}`} className={styles.link}>
      <Card hoverable className={styles.card}>
        <img
          src={poster(movie.poster_path) || PLACEHOLDER_IMAGE_PATH}
          alt={movie.title}
          className={styles.posterImage}
          loading="lazy"
        />
        <div className={styles.content}>
          <div className={styles.title}>{movie.title}</div>
          <div className={styles.year}>{year}</div>
        </div>
      </Card>
    </Link>
  );
}
