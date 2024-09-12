import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Popconfirm, message, Tooltip, Spin } from 'antd';
import { CopyOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import OperateModal from '@/components/operate-modal';
import useApiClient from '@/utils/request';
import { useTranslation } from '@/utils/i18n';

interface ConfigurationsModalProps {
  visible: boolean;
  onClose: () => void;
}

interface TableData {
  id: number;
  api_secret: string;
  created_at: string;
}

const initialDataSource: Array<TableData> = [];

const ConfigurationsModal: React.FC<ConfigurationsModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { get, post, del } = useApiClient();
  const [dataSource, setDataSource] = useState(initialDataSource);
  const [loading, setLoading] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await get('/base/user_api_secret/');
        setDataSource(data.map((item: TableData) => ({
          id: item.id,
          api_secret: item.api_secret,
          created_at: item.created_at,
        })));
      } catch (error) {
        message.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchData();
    }
  }, [get, visible]);

  const handleDelete = async (key: number) => {
    try {
      await del(`/base/user_api_secret/${key}/`);
      const newDataSource = dataSource.filter(item => item.id !== key);
      setDataSource(newDataSource);
      message.success(`Deleted key: ${key}`);
    } catch (error) {
      message.error('Failed to delete key');
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    message.success('Copied to clipboard');
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const data = await post('/base/user_api_secret/');
      const newEntry = {
        id: data.id,
        api_secret: data.api_secret,
        created_at: data.created_at,
      };
      setDataSource([...dataSource, newEntry]);
      message.success('Created new Secret key');
    } catch (error) {
      message.error('Failed to create new key');
    } finally {
      setCreating(false);
    }
  };

  const columns = [
    {
      title: t('secret.key'),
      dataIndex: 'api_secret',
      key: 'api_secret',
      ellipsis: {
        showTitle: false,
      },
      render: (secret: string) => (
        <Tooltip placement="topLeft" title={secret}>
          {secret}
        </Tooltip>
      ),
      width: 200,
    },
    {
      title: t('secret.createdAt'),
      dataIndex: 'created_at',
      key: 'created_at',
      width: 150,
    },
    {
      title: '',
      key: 'action',
      width: 80,
      render: (_: unknown, record: TableData) => (
        <Space size={0}>
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={() => handleCopy(record.api_secret)}
          ></Button>
          <Popconfirm
            title="Are you sure to delete this key?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" icon={<DeleteOutlined />} danger></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <OperateModal
      width={600}
      visible={visible}
      title={t('secret.title')}
      subTitle={t('secret.subTitle')}
      footer={null}
      onCancel={onClose}
    >
      <div style={{ overflowX: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin />
          </div>
        ) : (
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            rowKey="id"
          />
        )}
      </div>
      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          disabled={creating || dataSource.length > 0 || loading}
        >
          {creating ? <Spin /> : t('secret.create')}
        </Button>
      </div>
    </OperateModal>
  );
};

export default ConfigurationsModal;