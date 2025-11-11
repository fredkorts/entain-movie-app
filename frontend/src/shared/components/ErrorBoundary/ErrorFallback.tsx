import { Alert, Button } from "antd";
import { useTranslation } from "react-i18next";
import styles from "./ErrorFallback.module.css";

interface ErrorFallbackProps {
  error?: Error;
  onReset: () => void;
}

export default function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const { t } = useTranslation();
  
  return (
    <div className={styles.container}>
      <Alert
        type="error"
        message={t("error_boundary_title") || "Something went wrong"}
        description={
          <div>
            <p>{t("error_boundary_message") || "An unexpected error occurred. Please refresh the page and try again."}</p>
            {import.meta.env.DEV && error && (
              <details className={styles.errorDetails}>
                <summary>{t("error_boundary_details") || "Error Details (Development Only)"}</summary>
                <pre className={styles.errorStack}>{error.message}</pre>
              </details>
            )}
          </div>
        }
        showIcon
        action={
          <Button type="primary" onClick={onReset}>
            {t("error_boundary_retry") || "Try Again"}
          </Button>
        }
      />
    </div>
  );
}