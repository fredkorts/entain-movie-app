import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Alert, Button, Skeleton, Space, Tag, Typography } from "antd";
import { fetchMovieDetail } from "../api/moviesApi";
import type { MovieDetail } from "../api/types";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../lib/format";

const IMG = (p: string | null, w = 500) => (p ? `https://image.tmdb.org/t/p/w${w}${p}` : "");

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setErr(null);
    fetchMovieDetail(id)
      .then(d => { if (active) setData(d); })
      .catch(e => { if (active) setErr(e.message || t("failed_to_load")); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, t, i18n.language]);

  if (loading) return <Skeleton active paragraph={{ rows: 8 }} />;
  if (err) return <Alert type="error" message={t("error")} description={err} showIcon />;

  if (!data) return <Alert type="warning" message={t("movie_not_found")} showIcon />;

  return (
    <main>
      <Space style={{ marginBottom: 16 }}>
        <Button type="default" onClick={() => navigate(-1)}>{t("back")}</Button>
      </Space>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16, alignItems: "start" }}>
        <img
          src={IMG(data.poster_path, 500) || "/placeholder.svg"}
          alt={data.title}
          style={{ width: "100%", borderRadius: 8 }}
        />
        <div>
          <Typography.Title level={2} style={{ marginTop: 0 }}>{data.title}</Typography.Title>
          <p style={{ opacity: 0.9 }}>{data.overview || t("no_overview")}</p>
          <p><strong>{t("release")}:</strong> {formatDate(data.release_date, i18n.language)}</p>
          <p><strong>{t("runtime")}:</strong> {data.runtime ? `${data.runtime} ${t("minutes")}` : "—"}</p>
          <p><strong>{t("rating")}:</strong> {data.vote_average || "—"}</p>
          <div style={{ marginTop: 8 }}>
            {data.genres?.map(g => <Tag key={g.id}>{g.name}</Tag>)}
          </div>
        </div>
      </div>
    </main>
  );
}
