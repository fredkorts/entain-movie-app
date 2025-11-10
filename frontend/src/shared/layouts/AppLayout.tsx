import { Layout, Typography } from 'antd'
import { Outlet } from 'react-router-dom'
import styles from './AppLayout.module.scss'

const { Header, Content, Footer } = Layout

export default function AppLayout() {
  return (
    <Layout className={styles.wrap}>
      <Header className={styles.header}>
        <Typography.Title level={3} className={styles.title}>
          Movie Search
        </Typography.Title>
      </Header>
      
      <Content className={styles.content}>
        <Outlet />
      </Content>
      
      <Footer className={styles.footer}>
        © {new Date().getFullYear()} Movie Search
      </Footer>
    </Layout>
  )
}