import { useTranslation } from "react-i18next";
import styles from "./SkipLinks.module.scss";

export default function SkipLinks() {
  const { t } = useTranslation();

  return (
    <div className={styles.skipLinks}>
      <a 
        href="#main-content" 
        className={styles.skipLink}
      >
        {t("skip_to_main_content") || "Skip to main content"}
      </a>
      <a 
        href="#navigation" 
        className={styles.skipLink}
      >
        {t("skip_to_navigation") || "Skip to navigation"}
      </a>
    </div>
  );
}