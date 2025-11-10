import { Card } from "antd";

export type MovieSummary = {
  id: number;
  title: string;
  release_date?: string;
  vote_average?: number;
  poster_path?: string | null;
};

export default function MovieCard({ movie }: { movie: MovieSummary }) {
  const year = movie.release_date?.slice(0, 4) ?? "—";
  return (
    <Card hoverable>
      {/* For now no real posters; we'll add TMDB images later */}
      <div style={{ aspectRatio: "2/3", background: "#f5f5f5", borderRadius: 8 }} />
      <div style={{ marginTop: 8 }}>
        <div style={{ fontWeight: 600 }}>{movie.title}</div>
        <div style={{ opacity: 0.7, fontSize: 12 }}>{year}</div>
      </div>
    </Card>
  );
}
