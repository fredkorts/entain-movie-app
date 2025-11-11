import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Input, Pagination, Skeleton, Space, Empty, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import MovieCard from "../../components/MovieCard";
import styles from "./MoviesListPage.module.scss";
import { useDebounce } from "../../../../shared/hooks/useDebounce";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "../../../../lib/errorUtils";
import { useGetMoviesQuery } from "../../../../store/api/moviesApi";
import { MOVIES_PAGE_SIZE, SEARCH_DEBOUNCE_DELAY } from "../../../../lib/constants";

const { Text } = Typography;

const SKELETONS = Array.from({ length: MOVIES_PAGE_SIZE });

export default function MoviesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, i18n } = useTranslation();
  const mainRef = useRef<HTMLElement>(null);

  // Get page and query from URL search params
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const debouncedQ = useDebounce(q, SEARCH_DEBOUNCE_DELAY);

  const { data, isLoading, error } = useGetMoviesQuery({
    page,
    search: debouncedQ,
    lang: i18n.language,
  });

  const items = data?.results ?? [];
  const total = data?.total_results ?? 0;

  // Update URL search params
  const updateSearchParams = (newQ: string, newPage: number) => {
    const params = new URLSearchParams();
    if (newQ) params.set("q", newQ);
    if (newPage > 1) params.set("page", newPage.toString());
    setSearchParams(params, { replace: true });
  };

  const handleSearchChange = (value: string) => {
    updateSearchParams(value, 1); // Reset to page 1 on search
  };

  const handlePageChange = (newPage: number) => {
    updateSearchParams(q, newPage);
  };

  // Document title update based on debounced search query
  useEffect(() => {
    document.title = debouncedQ ? `Search: ${debouncedQ} - Movie App` : "Movies - Movie App";
  }, [debouncedQ]);

  // One-time focus management on mount
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, []); // Empty dependency array for one-time on mount

  return (
    <main className={styles.wrap} ref={mainRef} tabIndex={-1} aria-labelledby="page-title">
      <h1 id="page-title" className="sr-only">
        {q ? `Search results for: ${q}` : "Movies"}
      </h1>
      
      <Space direction="vertical" size="large" className={styles.toolbar}>
        <Input.Search
          placeholder={t("search_placeholder")}
          allowClear
          value={q}
          onChange={(e) => handleSearchChange(e.target.value)}
          aria-label={t("search_placeholder") || "Search movies"}
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
      </section>

      {!isLoading && !error && items.length === 0 && (
        <div className={styles.emptyState}>
          <Empty
            image={<SearchOutlined style={{ fontSize: 64, color: 'var(--color-text-tertiary)' }} />}
            description={
              <Space direction="vertical" size="small">
                <Text strong style={{ color: 'var(--color-text-primary)' }}>
                  {debouncedQ ? t("no_search_results") : t("no_results")}
                </Text>
                {debouncedQ && (
                  <Text type="secondary" style={{ color: 'var(--color-text-secondary)' }}>
                    {t("no_search_results_hint", { query: debouncedQ })}
                  </Text>
                )}
              </Space>
            }
          />
        </div>
      )}

      {!isLoading && total > MOVIES_PAGE_SIZE && (
        <div className={styles.pagination}>
          <Pagination
            current={data?.page ?? page}
            pageSize={MOVIES_PAGE_SIZE}
            total={total}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </main>
  );
}
