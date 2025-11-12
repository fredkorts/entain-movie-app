import { useParams, useNavigate } from "react-router-dom";
import { Alert, Button, Space, Skeleton, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import { getErrorMessage } from "../../../../lib/errorUtils";
import { useGetMovieDetailQuery } from "../../../../store/api/moviesApi";
import { DEFAULT_LANGUAGE } from "../../../../lib/constants";
import MovieHero from "../../components/MovieHero";
import CastSection from "../../components/CastSection";
import CrewSection from "../../components/CrewSection";
import VideosSection from "../../components/VideosSection";
import ReviewsSection from "../../components/ReviewsSection";
import styles from "./MovieDetailPage.module.scss";

const { Title, Paragraph } = Typography;

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data: movie, isLoading, error } = useGetMovieDetailQuery(
    { id: id!, lang: DEFAULT_LANGUAGE }, // We can add i18n.language back when ready
    { skip: !id }
  );
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);

  // Focus management and document title
  useEffect(() => {
    if (movie) {
      document.title = `${movie.title} - Movie App`;
      // Focus the main content after route change
      if (mainRef.current) {
        mainRef.current.focus();
      }
    } else if (!isLoading) {
      document.title = "Movie Not Found - Movie App";
    }
  }, [movie, isLoading]);

  if (isLoading) return (
    <div className={styles.page} data-testid="movie-detail-loading">
      <Skeleton active paragraph={{ rows: 8 }} className={styles.loadingSkeleton} />
    </div>
  );
  
  if (error) return (
    <div className={styles.page} data-testid="movie-detail-error">
      <Alert 
        type="error" 
        message={t("error")} 
        description={getErrorMessage(error, t("failed_to_load"))} 
        showIcon 
        className={styles.errorAlert}
        data-testid="error-alert"
      />
    </div>
  );
  
  if (!movie) return (
    <div className={styles.page} data-testid="movie-not-found">
      <Alert 
        type="warning" 
        message={t("movie_not_found")} 
        showIcon 
        className={styles.errorAlert}
        data-testid="not-found-alert"
      />
    </div>
  );

  return (
    <main className={styles.page} ref={mainRef} tabIndex={-1} aria-labelledby="movie-title" data-testid="movie-detail-page">
      <Space className={styles.backButton}>
        <Button type="default" onClick={() => navigate(-1)} data-testid="back-button">
          {t("back")}
        </Button>
      </Space>

      {/* Hero Section */}
      <MovieHero movie={movie} titleId="movie-title" />

      {/* Overview */}
      <div className={styles.overviewSection} data-testid="movie-overview">
        <Title level={3} className={styles.overviewTitle}>{t("overview")}</Title>
        <Paragraph className={styles.overviewText}>
          {movie.overview || t("no_overview")}
        </Paragraph>
      </div>

      {/* Cast */}
      {movie.cast && movie.cast.length > 0 && (
        <div className={styles.contentSection} data-testid="cast-section">
          <CastSection cast={movie.cast} />
        </div>
      )}

      {/* Crew */}
      {movie.crew && movie.crew.length > 0 && (
        <div className={styles.contentSection} data-testid="crew-section">
          <CrewSection crew={movie.crew} />
        </div>
      )}

      {/* Videos */}
      {movie.videos && movie.videos.length > 0 && (
        <div className={styles.contentSection} data-testid="videos-section">
          <VideosSection videos={movie.videos} />
        </div>
      )}

      {/* Reviews */}
      {movie.reviews && movie.reviews.length > 0 && (
        <div className={styles.contentSection} data-testid="reviews-section">
          <ReviewsSection reviews={movie.reviews} />
        </div>
      )}
    </main>
  );
}
