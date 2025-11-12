import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styles from './NotFoundPage.module.scss';

export default function NotFoundPage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('page_not_found_title');
  }, [t]);

  return (
    <div className={styles.container}>
      <Result
        status="404"
        title="404"
        subTitle={t('page_not_found_subtitle')}
        extra={
          <Link to="/">
            <Button type="primary" icon={<HomeOutlined />} size="large">
              {t('back_to_home')}
            </Button>
          </Link>
        }
      />
    </div>
  );
}
