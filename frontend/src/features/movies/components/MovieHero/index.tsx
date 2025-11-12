import { Typography, Row, Col, Tag, Rate } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { VideoCameraOutlined } from "@ant-design/icons";
import { formatDate } from "../../../../lib/format";
import { translateGenre } from "../../../../lib/genreTranslations";
import type { MovieDetail } from "../../api/types";
import { getTmdbImageUrl, TMDB_IMAGE_SIZES } from "../../../../lib/constants";
import styles from "./MovieHero.module.scss";

const { Title, Text } = Typography;

const IMG = (p: string | null, w: string = TMDB_IMAGE_SIZES.LARGE) => getTmdbImageUrl(p, w) || "";

interface MovieHeroProps {
  movie: MovieDetail;
  titleId?: string;
}

export default function MovieHero({ movie, titleId }: MovieHeroProps) {
  const { t, i18n } = useTranslation();
  const [posterError, setPosterError] = useState(false);

  const heroStyle: React.CSSProperties = {
    backgroundImage: movie.backdrop_path ? `url(${IMG(movie.backdrop_path, TMDB_IMAGE_SIZES.XLARGE)})` : "none",
  };

  const posterUrl = IMG(movie.poster_path, TMDB_IMAGE_SIZES.LARGE);
  const hasPoster = posterUrl && !posterError;

  return (
    <div className={styles.heroSection} style={heroStyle}>
      <div className={styles.heroOverlay}>
        <div className={styles.heroContent}>
          <Row gutter={24} align="middle">
            <Col xs={24} md={6}>
              <div className={styles.posterContainer}>
                {hasPoster ? (
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className={styles.poster}
                    onError={() => setPosterError(true)}
                  />
                ) : (
                  <div className={styles.posterFallback}>
                    <VideoCameraOutlined className={styles.fallbackIcon} />
                  </div>
                )}
              </div>
            </Col>
            <Col xs={24} md={18}>
              <div className={styles.movieInfo}>
                <Title level={1} className={styles.title} id={titleId} data-testid="movie-title">
                  {movie.title}
                </Title>
                
                {movie.tagline && (
                  <Text className={styles.tagline}>
                    "{movie.tagline}"
                  </Text>
                )}
                
                <div className={styles.genres}>
                  {movie.genres?.map((genre: { id: number; name: string }) => (
                    <Tag key={genre.id} color="blue" className={styles.genre}>
                      {translateGenre(genre.name, i18n.language)}
                    </Tag>
                  ))}
                </div>
                
                <div className={styles.movieDetails}>
                  <div className={styles.detailItem}>
                    <Text className={styles.detailLabel}>{t("release")}:</Text>
                    <Text className={styles.detailValue}>
                      {formatDate(movie.release_date, i18n.language)}
                    </Text>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <Text className={styles.detailLabel}>{t("runtime")}:</Text>
                    <Text className={styles.detailValue}>
                      {movie.runtime ? `${movie.runtime} ${t("minutes")}` : "—"}
                    </Text>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <Text className={styles.detailLabel}>{t("rating")}:</Text>
                    <div className={styles.ratingContainer}>
                      <Rate 
                        disabled 
                        value={movie.vote_average / 2} 
                        className={styles.stars} 
                      />
                      <Text className={styles.ratingValue}>
                        {movie.vote_average?.toFixed(1) || "—"}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}