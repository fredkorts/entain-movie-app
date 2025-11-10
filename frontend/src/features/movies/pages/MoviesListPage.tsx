import { useEffect, useMemo, useState } from "react";
import { Alert, Input, Pagination, Skeleton, Space } from "antd";
import MovieCard from "../components/MovieCard";
import type { MoviesResponse } from "../api/types";
import { fetchMovies } from "../api/moviesApi";
import styles from "./MoviesListPage.module.scss";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 12;

export default function MoviesListPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const { t, i18n } = useTranslation();

  const debouncedQ = useDebounce(q, 350);

  const [data, setData] = useState<MoviesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    setLoading(true);
    setErr(null);
    fetchMovies({ page, search: debouncedQ })
      .then((d) => { if (isActive) setData(d); })
      .catch((e) => { if (isActive) setErr(e.message || "Failed to load"); })
      .finally(() => { if (isActive) setLoading(false); });
    return () => { isActive = false; };
  }, [page, debouncedQ, i18n.language]);

  const items = data?.results ?? [];
  const total = data?.total_results ?? 0;

  // AntD Pagination uses total items; backend already returns total_results
  const skeletons = useMemo(() => Array.from({ length: PAGE_SIZE }), []);

  return (
    <main className={styles.wrap}>
      <Space direction="vertical" size="large" className={styles.toolbar}>
        <Input.Search
          placeholder={t("search_placeholder")}
          allowClear
          value={q}
          onChange={(e) => { setPage(1); setQ(e.target.value); }}
        />
      </Space>

      {err && <Alert type="error" message="Error loading movies" description={err} showIcon />}

      <section className={styles.grid} aria-live="polite">
        {loading &&
          skeletons.map((_, i) => (
            <div key={i} className={styles.card}><Skeleton active /></div>
          ))
        }

        {!loading && items.map((m) => (
          <div key={m.id} className={styles.card}>
            <MovieCard movie={m} />
          </div>
        ))}

        {!loading && !err && items.length === 0 && (
          <p>{t("no_results")}</p>
        )}
      </section>

      {!loading && total > PAGE_SIZE && (
        <div className={styles.pagination}>
          <Pagination
            current={data?.page ?? page}
            pageSize={PAGE_SIZE}
            total={total}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      )}
    </main>
  );
}
