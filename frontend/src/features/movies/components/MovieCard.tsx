import { Card } from "antd";
import { Link } from "react-router-dom";
import type { MovieSummary } from "../api/types";

const poster = (p: string | null, w = 342) => (p ? `https://image.tmdb.org/t/p/w${w}${p}` : "");

export default function MovieCard({ movie }: { movie: MovieSummary }) {
  const year = movie.release_date?.slice(0, 4) ?? "—";
  return (
    <Link to={`/movie/${movie.id}`} aria-label={`Open ${movie.title}`}>
      <Card hoverable>
        <img
          src={poster(movie.poster_path) || "/placeholder.svg"}
          alt={movie.title}
          style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", borderRadius: 8 }}
          loading="lazy"
        />
        <div style={{ marginTop: 8 }}>
          <div style={{ fontWeight: 600 }}>{movie.title}</div>
          <div style={{ opacity: 0.7, fontSize: 12 }}>{year}</div>
        </div>
      </Card>
    </Link>
  );
}
