import { Card, Typography, Row, Col } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { Video } from "../../api/types";
import { getYouTubeVideoUrl, getYouTubeThumbnailUrl, EXTERNAL_LINK_TARGET } from "../../../../lib/constants";
import styles from "./VideosSection.module.css";

const { Title } = Typography;

interface VideosSectionProps {
  videos: Video[];
}

export default function VideosSection({ videos }: VideosSectionProps) {
  const { t } = useTranslation();

  const trailers = videos.filter(v => v.type === "Trailer" && v.site === "YouTube");

  if (trailers.length === 0) return null;

  const handleVideoClick = (videoKey: string) => {
    window.open(getYouTubeVideoUrl(videoKey), EXTERNAL_LINK_TARGET);
  };

  return (
    <div className={styles.section}>
      <Title level={3} className={styles.title}>{t("videos")}</Title>
      <Row gutter={[16, 16]}>
        {trailers.slice(0, 3).map((video) => (
          <Col key={video.id} xs={24} sm={12} md={8}>
            <Card
              hoverable
              cover={
                <div 
                  className={styles.thumbnailContainer}
                  onClick={() => handleVideoClick(video.key)}
                >
                  <img
                    alt={video.name}
                    src={getYouTubeThumbnailUrl(video.key)}
                    className={styles.thumbnail}
                  />
                  <div className={styles.playIcon}>
                    <PlayCircleOutlined />
                  </div>
                </div>
              }
              onClick={() => handleVideoClick(video.key)}
            >
              <Card.Meta title={<span className={styles.videoTitle}>{video.name}</span>} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}