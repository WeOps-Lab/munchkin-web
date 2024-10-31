'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Input, DatePicker, Spin, Drawer } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import Icon from '@/components/icon';
import useApiClient from '@/utils/request';
import { useTranslation } from '@/utils/i18n';
import { useSearchParams } from 'next/navigation';
import type { ColumnType } from 'antd/es/table';
import ProChatComponent from '@/components/studio/proChat';
import { LogRecord, Channel } from '@/types/studio'

dayjs.extend(isBetween);

const { RangePicker } = DatePicker;

const StudioLogsPage: React.FC = () => {
  const { t } = useTranslation();
  const { get } = useApiClient();
  const [searchText, setSearchText] = useState<string>('');
  const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>([null, null]);
  const [data, setData] = useState<LogRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<LogRecord | null>(null);
  const searchParams = useSearchParams();
  const botId = searchParams.get('id');

  useEffect(() => {
    setLoading(true);

    new Promise<LogRecord[]>((resolve) => {
      setTimeout(() => {
        resolve([
          {
            key: '1',
            title: '你好',
            createdTime: '2024-08-01 23:00',
            updatedTime: '2024-08-01 23:00',
            user: 'kayla',
            channel: 'WeCom',
            count: 22,
            conversation: [
              { id: '1', role: 'user', content: '你好，帮助中心在哪里？', created_at: new Date() },
              { id: '2', role: 'assistant', content: '您好，帮助中心在右上角点击帮助即可找到。', created_at: new Date() },
            ],
          },
          {
            key: '2',
            title: 'weops咋用',
            createdTime: '2024-08-01 23:00',
            updatedTime: '2024-08-01 23:00',
            user: 'kayla',
            channel: 'WeCom',
            count: 1,
            conversation: [
              { id: '1', role: 'user', content: 'weops咋用', created_at: new Date() },
              { id: '2', role: 'assistant', content: '您可以通过查看帮助文档来了解 how to use weops。', created_at: new Date() },
            ],
          },
          {
            key: '3',
            title: 'weops咋用www....',
            createdTime: '2024-08-01 23:00',
            updatedTime: '2024-08-01 23:00',
            user: 'kayla',
            channel: 'WeCom',
            count: 2,
            conversation: [
              { id: '1', role: 'user', content: 'weops 咋用 www....', created_at: new Date() },
              { id: '2', role: 'assistant', content: '您可以通过查看帮助文档来了解 how to use weops。', created_at: new Date() },
            ],
          },
          {
            key: '4',
            title: 'weops咋用',
            createdTime: '2024-08-01 23:00',
            updatedTime: '2024-08-01 23:00',
            user: 'kayla',
            channel: 'WeCom',
            count: 33,
            conversation: [
              { id: '1', role: 'user', content: 'weops咋用', created_at: new Date() },
              { id: '2', role: 'assistant', content: '您可以通过查看帮助文档来了解 how to use weops。', created_at: new Date() },
            ],
          },
          {
            key: '5',
            title: 'weops咋用',
            createdTime: '2024-08-01 23:00',
            updatedTime: '2024-08-01 23:00',
            user: 'kayla',
            channel: 'WeCom',
            count: 3,
            conversation: [
              { id: '1', role: 'user', content: 'weops咋用', created_at: new Date() },
              { id: '2', role: 'assistant', content: '您可以通过查看帮助文档来了解 how to use weops。', created_at: new Date() },
            ],
          },
        ]);
      }, 2000);
    }).then((response) => {
      setData(response);
      setLoading(false);
    }).catch((error) => {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    });

    get('/bot_mgmt/bot/get_bot_channels/', { params: { bot_id: botId } })
      .then((response) => {
        setChannels(response.map((channel: any) => ({ id: channel.id, name: channel.name })));
      })
      .catch((error) => {
        console.error('Failed to fetch channels:', error);
      });
  }, [get]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleDateChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDates(dates);
  };

  const handleDetailClick = (record: LogRecord) => {
    setSelectedRecord(record);
    setDrawerVisible(true);
  };

  const filteredData = data.filter((record) => {
    const matchSearchText = record.title.includes(searchText);
    const matchDateRange = (!dates || (!dates[0] && !dates[1])) ||
      (dates && dates[0] && dates[1] && dayjs(record.createdTime).isBetween(dates[0], dates[1], null, '[]'));

    return matchSearchText && matchDateRange;
  });

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
    },
    {
      title: t('studio.logs.table.updatedTime'),
      dataIndex: 'updatedTime',
      key: 'updatedTime',
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
      onFilter: (value, record: LogRecord) => record.channel === String(value),
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
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
        <Input
          placeholder={t('common.search')}
          value={searchText}
          onChange={handleSearch}
          className='w-[240px] mr-[8px]'
        />
        <RangePicker
          value={dates as [Dayjs, Dayjs]}
          onChange={handleDateChange}
        />
      </div>
      {loading ? (
        <div className='w-full flex justify-center'>
          <Spin size="large" />
        </div>
      ) : (
        <Table dataSource={filteredData} columns={columns} pagination={false} />
      )}
      <Drawer
        title={t('studio.logs.detail')}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={480}
      >
        {selectedRecord && selectedRecord.conversation && (
          <ProChatComponent
            initialChats={selectedRecord.conversation}
          />
        )}
      </Drawer>
    </div>
  );
};

export default StudioLogsPage;