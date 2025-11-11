import { useCallback, memo } from "react";
import { Card, Typography, Avatar, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import type { CastMember } from "../../api/types";
import { getTmdbImageUrl, TMDB_IMAGE_SIZES } from "../../../../lib/constants";
import { useImageErrorHandling } from "../../../../shared/hooks/useImageErrorHandling";
import styles from "./CastSection.module.scss";

const { Title, Text } = Typography;

const IMG = (p: string | null, w: string = TMDB_IMAGE_SIZES.MEDIUM) => getTmdbImageUrl(p, w) || "";

interface CastSectionProps {
  cast: CastMember[];
}

function CastSection({ cast }: CastSectionProps) {
  const { t } = useTranslation();
  const { handleImageError, hasImageFailed } = useImageErrorHandling({
    resetOnDepsChange: [cast]
  });

  const renderCastImage = useCallback((member: CastMember) => {
    const imageHasFailed = hasImageFailed(member.id);
    const hasProfilePath = member.profile_path && !imageHasFailed;

    if (hasProfilePath) {
      return (
        <img
          alt={member.name}
          src={IMG(member.profile_path, TMDB_IMAGE_SIZES.MEDIUM)}
          className={styles.castImage}
          onError={() => handleImageError(member.id)}
        />
      );
    }

    // No profile image available or image failed to load - show fallback avatar
    return (
      <div className={styles.fallbackContainer}>
        <Avatar 
          size={80} 
          icon={<UserOutlined />}
          className={styles.fallbackAvatar}
        />
      </div>
    );
  }, [hasImageFailed, handleImageError]);

  if (!cast || cast.length === 0) return null;

  return (
    <div className={styles.section}>
      <Title level={3} className={styles.title}>{t("cast")}</Title>
      <Row gutter={[16, 16]}>
        {cast.slice(0, 8).map((member) => (
          <Col key={member.id} xs={12} sm={8} md={6} lg={4}>
            <Card
              hoverable
              cover={
                <div className={styles.imageContainer}>
                  {renderCastImage(member)}
                </div>
              }
              size="small"
            >
              <Card.Meta
                title={<Text className={styles.memberName}>{member.name}</Text>}
                description={<Text className={styles.memberRole}>{member.character}</Text>}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default memo(CastSection);