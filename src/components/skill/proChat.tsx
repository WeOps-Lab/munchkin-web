import React from 'react';
import dynamic from 'next/dynamic';
import { ProChatMessage } from '@/types/skill';
import styles from './index.module.less';

interface ProChatProps {
  request: (messages: ProChatMessage[]) => Promise<{ content: Response; [key: string]: any }>;
}

// @ts-ignore
const ProChat = dynamic<React.ComponentType<ProChatProps>>(async () => {
  const mod = await import('@ant-design/pro-chat');
  console.log('Module:', mod);
  return mod.default || mod;
}, { 
  ssr: false,
  loading: () => <div>Loading...</div>,
});

interface ChatComponentProps {
  handleSendMessage: (newMessage: ProChatMessage[]) => Promise<any>;
}

const ProChatComponent: React.FC<ChatComponentProps> = ({ handleSendMessage }) => {
  return (
    <div className="rounded-lg h-full">
      <h2 className="text-lg font-semibold mb-3">Test</h2>
      <div style={{ height: 'calc(100vh - 270px)' }} className={`rounded-lg ${styles.chatContainer}`}>
        <ProChat
          request={async (messages: ProChatMessage[]) => {
            const transformedMessages: ProChatMessage[] = messages.map(msg => ({
              id: Number(msg.id),
              content: String(msg.content),
              role: msg.role === 'user' ? 'user' : 'bot',
            }));
            try {
              const replyContent = await handleSendMessage(transformedMessages);
              return {
                content: new Response(replyContent),
                id: 'only-you-love-me',
                role: 'user-King',
                keys: ['Ovo']
              };
            } catch (error) {
              console.error('Failed to send message', error);
              return {
                content: new Response('Error: Failed to send message')
              };
            }
          }}
        />
      </div>
    </div>
  );
};

export default ProChatComponent;