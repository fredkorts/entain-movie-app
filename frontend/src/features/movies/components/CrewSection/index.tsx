import { useCallback, memo } from "react";
import { Typography, Avatar, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { translateJobTitle } from "../../../../lib/jobTitleTranslations";
import { useImageErrorHandling } from "../../../../shared/hooks/useImageErrorHandling";
import type { CrewMember } from "../../api/types";
import { getTmdbImageUrl, TMDB_IMAGE_SIZES } from "../../../../lib/constants";
import styles from "./CrewSection.module.scss";

const { Title, Text } = Typography;

const IMG = (p: string | null, w: string = TMDB_IMAGE_SIZES.LARGE) => getTmdbImageUrl(p, w) || "";

interface CrewSectionProps {
  crew: CrewMember[];
}

function CrewSection({ crew }: CrewSectionProps) {
  const { t, i18n } = useTranslation();
  const { handleImageError, hasImageFailed } = useImageErrorHandling({
    resetOnDepsChange: [crew]
  });

  // Group crew by department and show key roles
  const keyRoles = ["Director", "Producer", "Executive Producer", "Screenplay", "Story", "Writer"];
  const keyCrew = crew.filter(member => keyRoles.includes(member.job));

  const renderCrewAvatar = useCallback((member: CrewMember) => {
    const imageHasFailed = hasImageFailed(member.id);
    const hasProfilePath = member.profile_path && !imageHasFailed;

    if (hasProfilePath) {
      const imageUrl = IMG(member.profile_path, TMDB_IMAGE_SIZES.SMALL);
      return (
        <Avatar 
          size={40} 
          src={imageUrl}
          className={styles.avatar}
          onError={() => {
            console.warn(`Failed to load avatar for ${member.name}:`, imageUrl);
            handleImageError(member.id);
            return true; // Return true to trigger Avatar's fallback icon
          }}
        />
      );
    }

    // No profile image available or image failed to load - show fallback avatar
    return (
      <Avatar 
        size={40} 
        icon={<UserOutlined />}
        className={styles.avatar}
      />
    );
  }, [hasImageFailed, handleImageError]);

  if (!keyCrew || keyCrew.length === 0) return null;

  return (
    <div className={styles.section}>
      <Title level={3} className={styles.title}>{t("crew")}</Title>
      <Row gutter={[16, 8]}>
        {keyCrew.map((member) => (
          <Col key={`${member.id}-${member.job}`} xs={24} sm={12} lg={8}>
            <div className={styles.crewMember}>
              {renderCrewAvatar(member)}
              <div className={styles.memberInfo}>
                <Text className={styles.memberName}>{member.name}</Text>
                <Text className={styles.memberJob}>
                  {translateJobTitle(member.job, i18n.language)}
                </Text>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default memo(CrewSection);