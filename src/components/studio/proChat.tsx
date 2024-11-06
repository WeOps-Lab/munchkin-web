import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import styles from './index.module.less'
import { ProChatMessage } from '@/types/studio'

interface ChatComponentProps {
  initialChats: ProChatMessage[];
}

const ProChatComponentWrapper: React.FC<ChatComponentProps> = ({ initialChats }) => {
  const [ProChat, setProChat] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    const loadProChat = async () => {
      const { ProChat } = await import('@ant-design/pro-chat');
      setProChat(() => ProChat);
    };
    loadProChat();
  }, []);

  if (!ProChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin />
      </div>
    );
  }

  return (
    <div className={`rounded-lg h-full ${styles.proChatDetail}`}>
      <ProChat initialChats={initialChats} />
    </div>
  );
};

export default ProChatComponentWrapper;