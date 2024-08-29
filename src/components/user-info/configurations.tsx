import React, { useState } from 'react';
import { Button, Table, Space, Popconfirm, message } from 'antd';
import { CopyOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import OperateModal from '@/components/operate-modal';

interface ConfigurationsModalProps {
  visible: boolean;
  onClose: () => void;
}

interface TableData {
  key: string;
  secretKey: string;
  created: string;
  lastUsed: string;
}

const initialDataSource: Array<TableData> = [];

const ConfigurationsModal: React.FC<ConfigurationsModalProps> = ({ visible, onClose }) => {
  const [dataSource, setDataSource] = useState(initialDataSource);

  const handleDelete = (key: string) => {
    const newDataSource = dataSource.filter(item => item.key !== key);
    setDataSource(newDataSource);
    message.success(`Deleted key: ${key}`);
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    message.success('Copied to clipboard');
  };

  const handleCreate = () => {
    const newKey = `newKey-${Date.now()}`;
    const newEntry = {
      key: newKey,
      secretKey: 'newSecretKey',
      created: new Date().toISOString().split('T')[0],
      lastUsed: new Date().toISOString().split('T')[0],
    };
    setDataSource([...dataSource, newEntry]);
    message.info('Create button clicked');
  };

  const columns = [
    {
      title: 'Secret Key',
      dataIndex: 'secretKey',
      key: 'secretKey',
      width: 200,
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      width: 150,
    },
    {
      title: 'Last Used',
      dataIndex: 'lastUsed',
      key: 'lastUsed',
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
            onClick={() => handleCopy(record.secretKey)}>
          </Button>
          <Popconfirm
            title="Are you sure to delete this key?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" icon={<DeleteOutlined />} danger>
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <OperateModal
      width={600}
      visible={visible}
      title="API Secret Keys"
      subTitle="To prevent API abuse, protect your API Key."
      footer={null}
      onCancel={onClose}
    >
      <div style={{ overflowX: 'auto' }}>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </div>
      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          disabled={dataSource.length > 0}
        >
          Create new Secret key
        </Button>
      </div>
    </OperateModal>
  );
};

export default ConfigurationsModal;