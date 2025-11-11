import { Typography, Avatar, List } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../../lib/format";
import type { Review } from "../../api/types";
import { DEFAULT_LANGUAGE } from "../../../../lib/constants";
import styles from "./ReviewsSection.module.css";

const { Title, Paragraph } = Typography;

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const { t } = useTranslation();

  if (reviews.length === 0) return null;

  return (
    <div className={styles.section}>
      <Title level={3} className={styles.title}>{t("reviews")}</Title>
      <List
        className={styles.reviewsList}
        itemLayout="vertical"
        dataSource={reviews}
        renderItem={(review) => (
          <List.Item className={styles.reviewItem}>
            <List.Item.Meta
              className={styles.reviewMeta}
              avatar={<Avatar icon={<UserOutlined />} className={styles.reviewAvatar} />}
              title={<span className={styles.reviewAuthor}>{review.author}</span>}
              description={<span className={styles.reviewDate}>{formatDate(review.created_at, DEFAULT_LANGUAGE)}</span>}
            />
            <Paragraph 
              className={styles.reviewContent}
              ellipsis={{ rows: 3, expandable: true, symbol: t("read_more") || "Read more" }}
            >
              {review.content}
            </Paragraph>
          </List.Item>
        )}
      />
    </div>
  );
}