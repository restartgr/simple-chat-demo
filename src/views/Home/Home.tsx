import React from 'react';
import { Typography } from 'antd';
import ChatBot from '../../components/ChatBot/ChatBot';
import styles from './home.module.css';

const { Title } = Typography;

const HomeView: React.FC = () => {
  return (
    <div className={styles.home}>
      <div className={styles.header}>
        <Title level={1} className={styles.title}>
          智能旅游助手
        </Title>
      </div>

      <div className={styles.chatSection}>
        <ChatBot />
      </div>
    </div>
  );
};

export default HomeView;
