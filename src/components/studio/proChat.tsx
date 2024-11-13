import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Spin } from 'antd';
import throttle from 'lodash/throttle';
import styles from './index.module.less';
import { ProChatMessage } from '@/types/studio';
import useApiClient from '@/utils/request';

interface ChatComponentProps {
  initialChats: ProChatMessage[];
  conversationId: number[] | undefined;
  count: number;
}

const ProChatComponentWrapper: React.FC<ChatComponentProps> = ({ initialChats, conversationId, count }) => {
  const { post } = useApiClient();
  const [ProChat, setProChat] = useState<React.ComponentType<any> | null>(null);
  const [messages, setMessages] = useState<ProChatMessage[]>(initialChats);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const proChatContainerRef = useRef<HTMLDivElement | null>(null);

  const fetchMoreData = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const data = await post('/bot_mgmt/history/get_log_detail/', { ids: conversationId, page: page + 1, page_size: 20 });
      if (data.length === 0 || count <= messages.length) {
        setHasMore(false);
      } else {
        const newMessages = data.map((item: any, index: number) => ({
          id: `${page}-${index}`,
          role: item.role === 'bot' ? 'assistant' : 'user',
          content: item.content,
          created_at: new Date(item.created_at),
        }));

        setMessages((prevMessages) => [
          ...prevMessages,
          ...newMessages,
        ]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error('Error fetching more data:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, conversationId, post, count, messages]);

  const handleScroll = useCallback(throttle(() => {
    const scrollElement = proChatContainerRef.current?.querySelector('.ant-pro-chat-chat-list-container') as HTMLDivElement;
    if (!scrollElement || loading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollElement;

    // Check if we've scrolled to within 300px of the bottom
    if (scrollTop + clientHeight >= scrollHeight - 300) {
      fetchMoreData();
    }
  }, 200), [fetchMoreData, hasMore, loading]);

  useEffect(() => {
    if (page === 1) {
      fetchMoreData(); // 初始加载第二页
    }
  }, [fetchMoreData, page]);

  useEffect(() => {
    const loadProChat = async () => {
      const { ProChat } = await import('@ant-design/pro-chat');
      setProChat(() => ProChat);
    };
    loadProChat();
  }, []);

  // 更改监听器的添加和删除方式
  useEffect(() => {
    const proChatContainer = proChatContainerRef.current;
    const scrollElement = proChatContainer?.querySelector('.ant-pro-chat-chat-list-container') as HTMLDivElement;

    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  if (!ProChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin />
      </div>
    );
  }

  return (
    <div className={`rounded-lg h-full ${styles.proChatDetail}`} ref={proChatContainerRef}>
      <ProChat chats={messages} />
      {loading && <div className='flex justify-center items-center'><Spin /></div>}
    </div>
  );
};

export default ProChatComponentWrapper;