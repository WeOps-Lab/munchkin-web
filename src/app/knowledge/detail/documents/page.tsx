'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input, Button, Modal, message, Tag, Tabs } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import CustomTable from '@/components/custom-table';
import SelectSourceModal from './selectSourceModal';
import useApiClient from '@/utils/request';
import moment from 'moment';
import type { TableColumnsType, PaginationProps } from 'antd';
import { useTranslation } from '@/utils/i18n';

const { confirm } = Modal;
const { TabPane } = Tabs;

interface TableData {
  id: string | number;
  name: string;
  chunk_size: number;
  created_by: string;
  created_at: string;
  train_status: number;
  train_status_display: string;
  [key: string]: any
}

const DocumentsPage: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { get, post } = useApiClient();
  const [activeTabKey, setActiveTabKey] = useState<string>('file');
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
  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const desc = searchParams.get('desc');

  const randomColors = ['#ff9214', '#875cff', '#00cba6', '#155aef'];

  const getRandomColor = () => randomColors[Math.floor(Math.random() * randomColors.length)];

  const columns: TableColumnsType<TableData> = [
    {
      title: t('knowledge.documents.name'),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <a
          href="#"
          style={{ color: '#155aef' }}
          onClick={() => router.push(`/knowledge/detail/documents/result?id=${record.id}&name=${name}&desc=${desc}`)}
        >
          {text}
        </a>
      ),
    },
    {
      title: t('knowledge.documents.chunkSize'),
      dataIndex: 'chunk_size',
      key: 'chunk_size',
    },
    {
      title: t('knowledge.documents.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: t('knowledge.documents.createdBy'),
      key: 'created_by',
      dataIndex: 'created_by',
      render: (_, { created_by }) => (
        <div className='flex items-center'>
          <div
            className='flex items-center justify-center rounded-full text-white mr-2'
            style={{ width: 24, height: 24, backgroundColor: getRandomColor() }}
          >
            {created_by.charAt(0).toUpperCase()}
          </div>
          {created_by}
        </div>
      ),
    },
    {
      title: t('knowledge.documents.status'),
      key: 'train_status',
      dataIndex: 'train_status',
      render: (_, { train_status, train_status_display }) => {
        const statusColors: { [key: string]: string } = {
          '0': 'orange',
          '1': 'green',
          '2': 'red',
        };
    
        const color = statusColors[train_status] || 'geekblue';
        const text = train_status_display || '--';
    
        return <Tag color={color}>{text}</Tag>;
      },
    },   
    {
      title: t('knowledge.documents.actions'),
      key: 'action',
      render: (_, record) => (
        <>
          <Button type='link' className='mr-[10px]' onClick={() => handleSetClick(record)}>
            {t('common.set')}
          </Button>
          <Button type='link' onClick={() => handleDelete([record.id])}>
            {t('common.delete')}
          </Button>
        </>
      ),
    },
  ];

  const handleSetClick = (record: any) => {
    const config = {
      chunkParsing: record.enable_general_parse,
      chunkSize: record.general_parse_chunk_size,
      chunkOverlap: record.general_parse_chunk_overlap,
      semanticChunkParsing: record.enable_semantic_chunk_parse,
      semanticModel: record.semantic_chunk_parse_embedding_model,
      ocrEnhancement: record.enable_ocr_parse,
      ocrModel: record.ocr_model,
      excelParsing: record.enable_excel_parse,
      excelParseOption: record.excel_header_row_parse ? 'headerRow' : 'fullContent',
    };
    const queryParams = new URLSearchParams({
      id: id,
      documentId: record.id?.toString() || '',
      name: name || '',
      desc: desc || '',
      sourceType: activeTabKey,
      config: JSON.stringify(config),
    });
    router.push(`/knowledge/detail/documents/config?${queryParams.toString()}`);
  };

  const handleDelete = (keys: React.Key[]) => {
    confirm({
      title: t('common.delConfirm'),
      content: t('common.delConfirmCxt'),
      centered: true,
      onOk: async () => {
        try {
          await post('/knowledge_mgmt/knowledge_document/batch_delete/', {
            doc_ids: keys, 
            knowledge_base_id: id
          });
          const newData = tableData.filter(item => !keys.includes(item.id));
          setTableData(newData);
          setSelectedRowKeys([]);
          message.success(t('common.delSuccess'));
        } catch (error) {
          message.error(t('common.delFailed'));
        }
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
      name: searchText,
      page: current,
      page_size: pageSize,
      knowledge_source_type: activeTabKey,
      knowledge_base_id: id
    };
  }, [searchText, current, pageSize, activeTabKey]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = getTableParams();
    try {
      const res = await get('/knowledge_mgmt/knowledge_document/', { params });
      const { items: data } = res;
      setTableData(data);
      setPagination(prev => ({
        ...prev,
        total: res.count,
      }));
    } catch (error) {
      message.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [get, getTableParams]);

  useEffect(() => {
    fetchData();
    return () => {
      console.log('Component unmounted');
    };
  }, [fetchData, id]);

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
    router.push(`/knowledge/detail/documents/modify?type=${selectedType}&id=${id}&name=${name}&desc=${desc}`);
  };

  return (
    <div style={{marginTop: '-10px'}}>
      <Tabs defaultActiveKey='local' onChange={handleTabChange}>
        <TabPane tab={t('knowledge.localFile')} key='file' />
        <TabPane tab={t('knowledge.webLink')} key='web_page' />
        <TabPane tab={t('knowledge.cusText')} key='manual' />
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
            {t('common.add')}
          </Button>
          <Button
            type='primary'
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(selectedRowKeys)}
            disabled={!selectedRowKeys.length}
          >
            {t('common.batchDelete')}
          </Button>
        </div>
      </div>
      <CustomTable
        rowKey="id"
        rowSelection={rowSelection}
        scroll={{ y: 'calc(100vh - 460px)' }}
        columns={columns}
        dataSource={tableData}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
      <SelectSourceModal
        defaultSelected={activeTabKey}
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
};

export default DocumentsPage;