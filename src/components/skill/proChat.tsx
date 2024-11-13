import React, { useEffect, useState, useRef } from 'react';
import { ProChatMessage, ChatMessage } from '@/types/skill';
import { Spin } from 'antd';
import { useTranslation } from '@/utils/i18n';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import styles from './index.module.less';

interface ChatComponentProps {
  showSource: boolean;
  handleSendMessage: (newMessage: ProChatMessage[]) => Promise<any>;
}

const ProChatComponentWrapper: React.FC<ChatComponentProps> = ({ showSource = false, handleSendMessage }) => {
  const { t } = useTranslation();
  const [ProChat, setProChat] = useState<React.ComponentType<any> | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadProChat = async () => {
      const { ProChat } = await import('@ant-design/pro-chat');
      setProChat(() => ProChat);
    };
    loadProChat();
  }, []);

  const handleFullscreenToggle = () => {
    if (!containerRef.current) {
      return;
    }
    setIsFullscreen(!isFullscreen);
  };

  if (!ProChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`rounded-lg h-full ${isFullscreen ? styles.fullscreen : ''}`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">{t('skill.settings.test')}</h2>
        <button onClick={handleFullscreenToggle} aria-label="Toggle Fullscreen">
          {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        </button>
      </div>
      <div style={{ height: isFullscreen ? 'calc(100vh - 70px)' : 'calc(100vh - 280px)' }} className={styles.chatContainer}>
        <ProChat
          request={async (messages: ChatMessage<Record<string, any>>[]) => {
            const transformedMessages: ProChatMessage[] = messages.map((msg) => ({
              id: msg.id.toString(),
              content: String(msg.content),
              role: msg.role as 'user' | 'bot',
              createAt: new Date(),
              updateAt: new Date(),
            }));
            try {
              const reply = await handleSendMessage(transformedMessages);
              const { content, citing_knowledge } = reply;
              let responseContent = content;
              if (showSource) {
                const formattedCitingKnowledge = citing_knowledge.map((k: any) => `${k.knowledge_title}`).join(',');
                responseContent += `\n\n${t('skill.source')}: ${formattedCitingKnowledge}`;
              }
              
              return {
                content: new Response(responseContent),
              };
            } catch (error) {
              console.error(t('common.sendFailed'), error);
              return {
                content: new Response(`${t('common.error')}: ${t('common.sendFailed')}`),
              };
            }
          }}
        />
      </div>
    </div>
  );
};

export default ProChatComponentWrapper;