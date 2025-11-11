import { Typography, Avatar, Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { translateJobTitle } from "../../../../lib/jobTitleTranslations";
import type { CrewMember } from "../../api/types";
import { getTmdbImageUrl, TMDB_IMAGE_SIZES } from "../../../../lib/constants";
import styles from "./CrewSection.module.css";

const { Title, Text } = Typography;

const IMG = (p: string | null, w: string = TMDB_IMAGE_SIZES.LARGE) => getTmdbImageUrl(p, w) || "";

interface CrewSectionProps {
  crew: CrewMember[];
}

export default function CrewSection({ crew }: CrewSectionProps) {
  const { t, i18n } = useTranslation();

  // Group crew by department and show key roles
  const keyRoles = ["Director", "Producer", "Executive Producer", "Screenplay", "Story", "Writer"];
  const keyCrew = crew.filter(member => keyRoles.includes(member.job));

  if (!keyCrew || keyCrew.length === 0) return null;

  return (
    <div className={styles.section}>
      <Title level={3} className={styles.title}>{t("crew")}</Title>
      <Row gutter={[16, 8]}>
        {keyCrew.map((member) => (
          <Col key={`${member.id}-${member.job}`} xs={24} sm={12} lg={8}>
            <div className={styles.crewMember}>
              <Avatar 
                size={40} 
                src={IMG(member.profile_path, TMDB_IMAGE_SIZES.SMALL)} 
                icon={<UserOutlined />}
                className={styles.avatar}
              />
              <div className={styles.memberInfo}>
                <Text className={styles.memberName}>{member.name}</Text>
                <br />
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