import { Card, Skeleton } from "antd";
import styles from "./MovieCardSkeleton.module.scss";

export default function MovieCardSkeleton() {
  return (
    <Card className={styles.card} data-testid="movie-card-skeleton">
      <Skeleton.Image active className={styles.posterSkeleton} />
      <div className={styles.content}>
        <Skeleton 
          active 
          title={{ width: '80%' }} 
          paragraph={{ rows: 1, width: '40%' }}
          className={styles.textSkeleton}
        />
      </div>
    </Card>
  );
}
