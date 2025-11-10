import { Layout, Typography, Space } from "antd";
import { Outlet } from "react-router-dom";
import styles from "./AppLayout.module.scss";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeToggle from "../components/ThemeToggle";

const { Header, Content, Footer } = Layout;

export default function AppLayout() {
  const { t } = useTranslation();
  return (
    <Layout className={styles.wrap}>
      <Header className={styles.header}>
        <Typography.Title level={3} className={styles.title}>{t("app_title")}</Typography.Title>
        <Space size="large" style={{ marginLeft: "auto" }}>
          <LanguageSwitcher />
          <ThemeToggle />
        </Space>
      </Header>
      <Content className={styles.content}>
        <Outlet />
      </Content>
      <Footer className={styles.footer}>© {new Date().getFullYear()} Movie Search</Footer>
    </Layout>
  );
}
