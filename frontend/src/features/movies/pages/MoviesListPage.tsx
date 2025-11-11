import { useState } from "react";
import { Alert, Input, Pagination, Skeleton, Space } from "antd";
import MovieCard from "../components/MovieCard";
import styles from "./MoviesListPage.module.scss";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "../../../lib/errorUtils";
import { useGetMoviesQuery } from "../../../store/api/moviesApi";

const PAGE_SIZE = 10; // Custom page size for better UX
const SKELETONS = Array.from({ length: PAGE_SIZE });

export default function MoviesListPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const { t, i18n } = useTranslation();

  const debouncedQ = useDebounce(q, 350);

  const { data, isLoading, error } = useGetMoviesQuery({
    page,
    search: debouncedQ,
    lang: i18n.language,
  });

  const items = data?.results ?? [];
  const total = data?.total_results ?? 0;

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

      {error && (
        <Alert 
          type="error" 
          message={t("error")} 
          description={getErrorMessage(error, t("failed_to_load"))} 
          showIcon 
        />
      )}

      <section className={styles.grid} aria-live="polite">
        {isLoading &&
          SKELETONS.map((_, i) => (
            <div key={i} className={styles.card}><Skeleton active /></div>
          ))
        }

        {!isLoading && items.map((m) => (
          <div key={m.id} className={styles.card}>
            <MovieCard movie={m} />
          </div>
        ))}

        {!isLoading && !error && items.length === 0 && (
          <p>{t("no_results")}</p>
        )}
      </section>

      {!isLoading && total > PAGE_SIZE && (
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
