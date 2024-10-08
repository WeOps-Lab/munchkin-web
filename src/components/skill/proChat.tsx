import React, { useEffect, useState } from 'react';
import { ProChatMessage, ChatMessage } from '@/types/skill';
import styles from './index.module.less';

interface ChatComponentProps {
  handleSendMessage: (newMessage: ProChatMessage[]) => Promise<any>;
}

const ProChatComponentWrapper: React.FC<ChatComponentProps> = ({ handleSendMessage }) => {
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
      <div style={{ height: 'calc(100vh - 270px)' }} className={`rounded-lg ${styles.chatContainer}`}>
        <ProChat
          request={async (messages: ChatMessage<Record<string, any>>[]) => {
            const transformedMessages: ProChatMessage[] = messages.map((msg) => ({
              id: msg.id.toString(), // 确保 id 是字符串类型
              content: String(msg.content), // 确保 content 是字符串
              role: msg.role as 'user' | 'bot', // 明确设置类型
              createAt: new Date(), // 添加 createAt 属性
              updateAt: new Date(), // 添加 updateAt 属性
            }));
            try {
              const replyContent = await handleSendMessage(transformedMessages);
              return {
                content: new Response(replyContent),
              };
            } catch (error) {
              console.error('Failed to send message', error);
              return {
                content: new Response('Error: Failed to send message'),
              };
            }
          }}
        />
      </div>
    </div>
  );
};

export default ProChatComponentWrapper;