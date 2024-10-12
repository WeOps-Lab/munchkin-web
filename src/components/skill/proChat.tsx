import React, { useEffect, useState } from 'react';
import { ProChatMessage, ChatMessage } from '@/types/skill';
import { useTranslation } from '@/utils/i18n';
import styles from './index.module.less';

interface ChatComponentProps {
  showSource: boolean;
  handleSendMessage: (newMessage: ProChatMessage[]) => Promise<any>;
}

const ProChatComponentWrapper: React.FC<ChatComponentProps> = ({ showSource = false, handleSendMessage }) => {
  const { t } = useTranslation();
  const [ProChat, setProChat] = useState<React.ComponentType<any> | null>(null);
  
  useEffect(() => {
    const loadProChat = async () => {
      const { ProChat } = await import('@ant-design/pro-chat');
      setProChat(() => ProChat);
    };
    loadProChat();
  }, []);

  if (!ProChat) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-lg h-full">
      <h2 className="text-lg font-semibold mb-3">Test</h2>
      <div style={{ height: 'calc(100vh - 280px)' }} className={`rounded-lg ${styles.chatContainer}`}>
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