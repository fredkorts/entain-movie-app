import { Card } from "antd";
import type { MovieSummary } from "../api/types";

export default function MovieCard({ movie }: { movie: MovieSummary }) {
  const year = movie.release_date?.slice(0, 4) ?? "—";
  return (
    <Card hoverable>
      <div style={{ aspectRatio: "2/3", background: "#f5f5f5", borderRadius: 8 }} />
      <div style={{ marginTop: 8 }}>
        <div style={{ fontWeight: 600 }}>{movie.title}</div>
        <div style={{ opacity: 0.7, fontSize: 12 }}>{year}</div>
      </div>
    </Card>
  );
}
