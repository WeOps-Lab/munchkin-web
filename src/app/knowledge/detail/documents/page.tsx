'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input, Button, Modal, message, Tag, Tabs } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import CustomTable from '@/components/custom-table';
import SelectSourceModal from './selectSourceModal'; // 确保路径正确
import type { TableColumnsType, PaginationProps } from 'antd';

const { confirm } = Modal;
const { TabPane } = Tabs;

interface TableData {
  key: string;
  name: string;
  total: number;
  create_time: string;
  creater: string;
  status: string;
}

const DocumentsPage: React.FC = () => {
  const router = useRouter();
  const [activeTabKey, setActiveTabKey] = useState<string>('local');
  const [searchText, setSearchText] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationProps>({
    current: 1,
    total: 0,
    pageSize: 20,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const param1 = searchParams.get('id');

  const columns: TableColumnsType<TableData> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'TOTAL DATA',
      dataIndex: 'total',
      key: 'total',
    },
    {
      title: 'CREATE TIME',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: 'CREATER',
      key: 'creater',
      dataIndex: 'creater',
      render: (_, { creater }) => (
        <div className='flex items-center'>
          <div
            className='flex items-center justify-center rounded-full bg-blue-500 text-white mr-2'
            style={{ width: 24, height: 24 }}
          >
            {creater.charAt(0).toUpperCase()}
          </div>
          {creater}
        </div>
      ),
    },
    {
      title: 'STATUS',
      key: 'status',
      dataIndex: 'status',
      render: (_, { status }) => (
        <Tag color={status === 'Ready' ? 'green' : 'geekblue'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'ACTIONS',
      key: 'action',
      render: (_, record) => (
        <>
          <Button type='link' className='mr-[10px]'>
            Edit
          </Button>
          <Button type='link' onClick={() => handleDelete([record.key])}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  const handleDelete = (keys: React.Key[]) => {
    confirm({
      title: 'Do you want to delete the selected item(s)?',
      content: 'After deletion, the data cannot be recovered.',
      centered: true,
      onOk() {
        const newData = tableData.filter(item => !keys.includes(item.key));
        setTableData(newData);
        setSelectedRowKeys([]);
        message.success('Delete successfully!');
      },
    });
  };

  const onSearchTxtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const onTxtPressEnter = () => {
    fetchData();
  };

  const onTxtClear = () => {
    fetchData();
  };

  const handleTableChange = (pagination: PaginationProps) => {
    setPagination(pagination);
  };

  const { current, pageSize } = pagination;

  const getTableParams = useCallback(() => {
    return {
      search: searchText,
      current,
      limit: pageSize,
    };
  }, [searchText, current, pageSize]);

  const generateRandomData = (count: number, type: string): TableData[] => {
    return Array.from({ length: count }, (_, index) => ({
      key: index.toString(),
      name: type === 'local' ? '用户指南.docx' : type === 'web' ? 'https://example.com' : 'Custom Text',
      total: 24,
      create_time: '2024-08-30 10:51:42',
      creater: 'kayla',
      status: 'Ready',
    }));
  };

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = getTableParams();
    console.log(params);
    setTimeout(() => {
      const data = generateRandomData(25, activeTabKey);
      setTableData(data);
      setPagination(prev => ({
        ...prev,
        total: data.length,
      }));
      setLoading(false);
    }, 500);
  }, [activeTabKey, getTableParams]);

  useEffect(() => {
    console.log(param1);
    fetchData();
    return () => {
      console.log('Component unmounted');
    };
  }, [fetchData, param1]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const handleAddClick = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleModalConfirm = (selectedType: string) => {
    setIsModalVisible(false);
    router.push(`/knowledge/detail/documents/modify?type=${selectedType}`);
  };

  return (
    <div>
      <Tabs defaultActiveKey='local' onChange={handleTabChange}>
        <TabPane tab='Local file' key='local' />
        <TabPane tab='Web link' key='web' />
        <TabPane tab='Custom text' key='custom' />
      </Tabs>
      <div className='nav-box flex justify-end mb-[10px]'>
        <div className='left-side w-[240px] mr-[8px]'>
          <Input
            placeholder='search...'
            value={searchText}
            allowClear
            onChange={onSearchTxtChange}
            onPressEnter={onTxtPressEnter}
            onClear={onTxtClear}
          />
        </div>
        <div className='right-side flex'>
          <Button
            type='primary'
            className='mr-[8px]'
            icon={<PlusOutlined />}
            onClick={handleAddClick}
          >
            Add
          </Button>
          <Button
            type='primary'
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(selectedRowKeys)}
            disabled={!selectedRowKeys.length}
          >
            Batch Delete
          </Button>
        </div>
      </div>
      <CustomTable
        rowSelection={rowSelection}
        scroll={{ y: 'calc(100vh - 345px)' }}
        columns={columns}
        dataSource={tableData}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      <SelectSourceModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default DocumentsPage;