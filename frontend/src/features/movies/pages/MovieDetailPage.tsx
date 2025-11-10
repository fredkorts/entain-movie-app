import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Alert, Button, Skeleton, Space, Tag, Typography } from "antd";
import { fetchMovieDetail } from "../api/moviesApi";
import type { MovieDetail } from "../api/types";

const IMG = (p: string | null, w = 500) => (p ? `https://image.tmdb.org/t/p/w${w}${p}` : "");

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setErr(null);
    fetchMovieDetail(id)
      .then(d => { if (active) setData(d); })
      .catch(e => { if (active) setErr(e.message || "Failed to load movie"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <Skeleton active paragraph={{ rows: 8 }} />;
  if (err) return <Alert type="error" message="Error" description={err} showIcon />;

  if (!data) return <Alert type="warning" message="Movie not found" showIcon />;

  return (
    <main>
      <Space style={{ marginBottom: 16 }}>
        <Button type="default" onClick={() => navigate(-1)}>← Back</Button>
      </Space>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16, alignItems: "start" }}>
        <img
          src={IMG(data.poster_path, 500) || "/placeholder.svg"}
          alt={data.title}
          style={{ width: "100%", borderRadius: 8 }}
        />
        <div>
          <Typography.Title level={2} style={{ marginTop: 0 }}>{data.title}</Typography.Title>
          <p style={{ opacity: 0.9 }}>{data.overview || "No overview available."}</p>
          <p><strong>Release:</strong> {data.release_date || "—"}</p>
          <p><strong>Runtime:</strong> {data.runtime ? `${data.runtime} min` : "—"}</p>
          <p><strong>Rating:</strong> {data.vote_average || "—"}</p>
          <div style={{ marginTop: 8 }}>
            {data.genres?.map(g => <Tag key={g.id}>{g.name}</Tag>)}
          </div>
        </div>
      </div>
    </main>
  );
}
