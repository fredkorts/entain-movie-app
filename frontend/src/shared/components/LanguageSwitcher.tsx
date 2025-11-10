import { Dropdown } from "antd";
import type { MenuProps } from "antd";
import i18n from "../../i18n";
import { useState } from "react";

const langs = [
  { key: "en", label: "EN" },
  { key: "et", label: "ET" },
  { key: "ru", label: "RU" }
];

export default function LanguageSwitcher() {
  const [cur, setCur] = useState(i18n.language.split("-")[0] || "en");

  const onClick: MenuProps["onClick"] = ({ key }) => {
    i18n.changeLanguage(key);
    localStorage.setItem("lang", key);
    setCur(String(key));
  };

  return (
    <Dropdown
      trigger={["click"]}
      menu={{ items: langs, onClick }}
    >
      <button aria-label="Change language" style={{ border: 0, background: "transparent", cursor: "pointer" }}>
        {cur.toUpperCase()}
      </button>
    </Dropdown>
  );
}
