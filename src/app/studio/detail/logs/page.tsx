'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Table, Input, DatePicker, Spin, Drawer, Button, Pagination, Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import Icon from '@/components/icon';
import useApiClient from '@/utils/request';
import { useTranslation } from '@/utils/i18n';
import { useSearchParams } from 'next/navigation';
import type { ColumnType } from 'antd/es/table';
import ProChatComponent from '@/components/studio/proChat';
import { LogRecord, Channel } from '@/types/studio';
import { useLocalizedTime } from '@/hooks/useLocalizedTime';

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;
const { Search } = Input;

const StudioLogsPage: React.FC = () => {
  const { t } = useTranslation();
  const { get, post } = useApiClient();
  const { convertToLocalizedTime } = useLocalizedTime();
  const [searchText, setSearchText] = useState('');
  const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>([null, null]);
  const [data, setData] = useState<LogRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<LogRecord | null>(null);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const botId = searchParams.get('id');

  // 使用useCallback防止每次渲染重新创建fetchLogs函数
  const fetchLogs = useCallback(async (searchText = '', dates: [Dayjs | null, Dayjs | null] | null = [null, null], page = 1, pageSize = 10, selectedChannels: string[] = []) => {
    setLoading(true);
    try {
      const params: any = { bot_id: botId, page, page_size: pageSize };
      if (searchText) params.search = searchText;
      if (dates && dates[0] && dates[1]) {
        params.start_time = dates[0].toISOString();
        params.end_time = dates[1].toISOString();
      }
      if (selectedChannels.length > 0) params.channel_type = selectedChannels.join(',');

      const res = await get('/bot_mgmt/history/search_log/', { params });
      setData(res.items.map((item: any, index: number) => ({
        key: index.toString(),
        title: item.title,
        createdTime: item.created_at,
        updatedTime: item.updated_at,
        user: item.username,
        channel: item.channel_type,
        count: item.count,
        ids: item.ids,
      })));
      setTotal(res.count);
    } catch (error) {
      console.error(`${t('common.fetchFailed')}:`, error);
    }
    setLoading(false);
  }, [get, botId]);

  useEffect(() => {
    fetchLogs();
    
    const fetchChannels = async () => { 
      try {
        const data = await get('/bot_mgmt/bot/get_bot_channels/', { params: { bot_id: botId } });
        setChannels(data.map((channel: any) => ({ id: channel.id, name: channel.name })));
      } catch (error) {
        console.error(`${t('common.fetchFailed')}:`, error);
      }
    }
    fetchChannels();
  }, [get, botId, fetchLogs]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setSelectedChannels([]);
    setPagination({ ...pagination, current: 1 });
    fetchLogs(value, dates, 1, pagination.pageSize, []);
  };

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDates(dates);
    setSelectedChannels([]);
    setPagination({ ...pagination, current: 1 });
    fetchLogs(searchText, dates, 1, pagination.pageSize, []);
  };

  const handleDetailClick = async (record: LogRecord) => {
    setSelectedConversation(record);
    setDrawerVisible(true);
    setConversationLoading(true);

    try {
      const data = await post('/bot_mgmt/history/get_log_detail/', { ids: record.ids, page: 1, page_size: 20 });
      setSelectedConversation({
        ...record,
        conversation: data.map((item: any, index: number) => ({
          id: index.toString(),
          role: item.role === 'bot' ? 'assistant' : 'user',
          content: item.content,
          created_at: new Date(),
        })),
      });
    } catch(error) {
      console.error(`${t('common.fetchFailed')}:`, error);
    } finally {
      setConversationLoading(false);
    }
  };

  const handleTableChange = (page: number, pageSize?: number) => {
    const newPagination = {
      current: page,
      pageSize: pageSize || pagination.pageSize,
    };
    setPagination(newPagination);
    fetchLogs(searchText, dates, newPagination.current, newPagination.pageSize, selectedChannels);
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setPagination({ current, pageSize: size });
    fetchLogs(searchText, dates, current, size, selectedChannels);
  };

  const channelFilters = channels.map(channel => ({ text: channel.name, value: channel.name }));

  const columns: ColumnType<LogRecord>[] = [
    {
      title: t('studio.logs.table.title'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: t('studio.logs.table.createdTime'),
      dataIndex: 'createdTime',
      key: 'createdTime',
      render: (text) => convertToLocalizedTime(text),
    },
    {
      title: t('studio.logs.table.updatedTime'),
      dataIndex: 'updatedTime',
      key: 'updatedTime',
      render: (text) => convertToLocalizedTime(text),
    },
    {
      title: t('studio.logs.table.user'),
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: t('studio.logs.table.channel'),
      dataIndex: 'channel',
      key: 'channel',
      filters: channelFilters,
      filteredValue: selectedChannels,
      onFilter: () => true,
      render: (text: string) => (
        <div className="flex">
          <Icon type="qiwei_qiwei" className="text-xl mr-[4px]" />
          {text}
        </div>
      ),
    },
    {
      title: t('studio.logs.table.count'),
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: t('studio.logs.table.actions'),
      key: 'actions',
      render: (text: any, record: LogRecord) => (
        <Button type="link" onClick={() => handleDetailClick(record)}>
          {t('studio.logs.table.detail')}
        </Button>
      ),
    },
  ];

  return (
    <div className='h-full flex flex-col'>
      <div className='mb-[20px]'>
        <div className='flex justify-end space-x-4'>
          <Search
            placeholder={`${t('studio.logs.searchUser')}...`}
            allowClear
            onSearch={handleSearch}
            enterButton
            className='w-60'
          />
          <RangePicker
            showTime
            value={dates as [Dayjs, Dayjs]}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <div className='flex-grow'>
        {loading ? (
          <div className='w-full flex items-center justify-center min-h-72'>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={data}
            columns={columns}
            pagination={false}
            scroll={{ y: 'calc(100vh - 400px)' }}
          />
        )}
      </div>
      <div className='fixed bottom-8 right-8'>
        {!loading && (
          <Pagination
            total={total}
            showSizeChanger
            hideOnSinglePage
            current={pagination.current}
            pageSize={pagination.pageSize}
            onChange={handleTableChange}
            onShowSizeChange={handlePageSizeChange}
          />
        )}
      </div>
      <Drawer
        title={
          <div className="flex items-center">
            <span>{selectedConversation?.user}</span>
            <Tag color="blue" className='ml-4' icon={<ClockCircleOutlined />}>{selectedConversation?.count} {t('studio.logs.records')}</Tag>
          </div>
        }
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={680}
      >
        {conversationLoading ? (
          <div className='flex justify-center items-center w-full h-full'>
            <Spin />
          </div>
        ) : (
          selectedConversation && selectedConversation.conversation && (
            <ProChatComponent
              initialChats={selectedConversation.conversation}
              conversationId={selectedConversation.ids}
              count={selectedConversation.count}
            />
          )
        )}
      </Drawer>
    </div>
  );
};

export default StudioLogsPage;