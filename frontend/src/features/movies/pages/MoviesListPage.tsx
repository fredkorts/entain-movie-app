import { useMemo, useState } from "react";
import { Input, Pagination, Space } from "antd";
import MovieCard, { type MovieSummary } from "../components/MovieCard";
import styles from "./MoviesListPage.module.scss";

// Simple mock dataset (we'll replace with API next step)
const MOCK: MovieSummary[] = Array.from({ length: 87 }, (_, i) => ({
  id: i + 1,
  title: `Sample Movie #${i + 1}`,
  release_date: `20${String(10 + (i % 15)).padStart(2, "0")}-01-01`,
  vote_average: Math.round(((i % 10) + 1) * 10) / 10,
}));

const PAGE_SIZE = 12;

export default function MoviesListPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return MOCK;
    const s = q.trim().toLowerCase();
    return MOCK.filter(m => m.title.toLowerCase().includes(s));
  }, [q]);

  const total = filtered.length;
  const current = Math.min(page, Math.max(1, Math.ceil(total / PAGE_SIZE) || 1));
  const start = (current - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  return (
    <main className={styles.wrap}>
      <Space direction="vertical" size="large" className={styles.toolbar}>
        <Input.Search
          placeholder="Search movies"
          allowClear
          value={q}
          onChange={(e) => { setPage(1); setQ(e.target.value); }}
        />
      </Space>

      <section className={styles.grid} aria-live="polite">
        {pageItems.map(m => (
          <div key={m.id} className={styles.card}>
            <MovieCard movie={m} />
          </div>
        ))}
        {pageItems.length === 0 && <p>No results found</p>}
      </section>

      {total > PAGE_SIZE && (
        <div className={styles.pagination}>
          <Pagination
            current={current}
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
