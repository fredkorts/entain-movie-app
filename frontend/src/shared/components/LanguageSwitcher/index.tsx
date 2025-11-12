import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import i18n from "../../../i18n";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSwitcher.module.scss";

const langs = [
  { key: "en", label: "EN" },
  { key: "et", label: "ET" },
  { key: "ru", label: "RU" }
];

export default function LanguageSwitcher() {
  const [cur, setCur] = useState(i18n.language.split("-")[0] || "en");
  const { t } = useTranslation();

  // Sync with i18n changes (including external changes)
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCur(lng.split("-")[0] || "en");
    };
    
    // Set initial state
    handleLanguageChange(i18n.language);
    
    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const onClick: MenuProps["onClick"] = ({ key }) => {
    try {
      i18n.changeLanguage(key);
      // Save to localStorage only after successful language change
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem("lang", key);
      }
    } catch (error) {
      console.warn('Failed to change language:', error);
    }
  };

  return (
    <Dropdown
      trigger={["click"]}
      menu={{ items: langs, onClick }}
    >
      <button 
        aria-label={t("change_language") || "Change language"} 
        className={styles.switcherButton}
        data-testid="language-switcher"
      >
        {cur.toUpperCase()}
      </button>
    </Dropdown>
  );
}
