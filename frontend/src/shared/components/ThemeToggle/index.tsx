import { useContext } from "react";
import { Switch } from "antd";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../../theme/ThemeContext";

export default function ThemeToggle() {
  const { mode, toggle } = useContext(ThemeContext);
  const { t } = useTranslation();
  
  return (
    <Switch
      checked={mode === "dark"}
      onChange={toggle}
      checkedChildren="🌙"
      unCheckedChildren="☀️"
      aria-label={t("toggle_theme") || "Toggle theme"}
    />
  );
}
