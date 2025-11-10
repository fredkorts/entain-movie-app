import { useContext } from "react";
import { Switch } from "antd";
import { ThemeContext } from "../../theme/ThemeContext";

export default function ThemeToggle() {
  const { mode, toggle } = useContext(ThemeContext);
  return (
    <Switch
      checked={mode === "dark"}
      onChange={toggle}
      checkedChildren="🌙"
      unCheckedChildren="☀️"
      aria-label="Toggle theme"
    />
  );
}
