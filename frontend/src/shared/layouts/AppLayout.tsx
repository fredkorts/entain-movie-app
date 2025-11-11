import { Layout, Typography, Space } from "antd";
import { Outlet } from "react-router-dom";
import styles from "./AppLayout.module.scss";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";
import ThemeToggle from "../components/ThemeToggle";
import SkipLinks from "../components/SkipLinks";

const { Header, Content, Footer } = Layout;

export default function AppLayout() {
  const { t } = useTranslation();
  return (
    <>
      <SkipLinks />
      <Layout className={styles.wrap}>
        <Header className={styles.header} id="navigation">
          <Typography.Title level={3} className={styles.title}>{t("app_title")}</Typography.Title>
          <Space size="large" className={styles.headerActions}>
            <LanguageSwitcher />
            <ThemeToggle />
          </Space>
        </Header>
        <Content className={styles.content} id="main-content">
          <Outlet />
        </Content>
        <Footer className={styles.footer}>© {new Date().getFullYear()} {t("app_copyright")}</Footer>
      </Layout>
    </>
  );
}
