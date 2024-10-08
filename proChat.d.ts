declare module '@ant-design/pro-chat' {
    import { ComponentType } from 'react';
  
    interface ChatMessage<T extends Record<string, any> = Record<string, any>> {
      id: string;
      role: 'user' | 'bot';
      content: string;
      createAt?: Date;
      updateAt?: Date;
      [key: string]: any;
    }
  
    interface ProChatProps {
      request: (messages: ChatMessage[]) => Promise<{ content: Response, [key: string]: any }>;
    }
  
    export const ProChat: ComponentType<ProChatProps>;
  }  