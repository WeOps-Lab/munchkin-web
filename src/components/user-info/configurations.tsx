import React, { useState, useEffect } from 'react';
import { Button, Table, Space, Popconfirm, message, Tooltip, Spin, Modal, Select } from 'antd';
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
  team: string;
  team_name?: string;
}

const initialDataSource: Array<TableData> = [];

const ConfigurationsModal: React.FC<ConfigurationsModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const { get, post, del } = useApiClient();
  const [dataSource, setDataSource] = useState(initialDataSource);
  const [loading, setLoading] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [groupVisible, setGroupVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const data = await get('/knowledge_mgmt/knowledge_base/get_teams/');
        setGroups(data);
        return data;
      } catch (error) {
        message.error(t('common.fetchFailed'));
        return [];
      }
    };

    const fetchData = async (groups: any[]) => {
      try {
        const data = await get('/base/user_api_secret/');
        setDataSource(data.map((item: TableData) => ({
          id: item.id,
          api_secret: item.api_secret,
          created_at: item.created_at,
          team: item.team,
          team_name: groups.find(group => group.id === item.team)?.name,
        })));
      } catch (error) {
        message.error(t('common.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchGroups().then((groupData) => fetchData(groupData));
    }
  }, [get, visible]);

  const handleDelete = async (key: number) => {
    try {
      await del(`/base/user_api_secret/${key}/`);
      const newDataSource = dataSource.filter(item => item.id !== key);
      setDataSource(newDataSource);
      message.success(`Deleted key: ${key}`);
    } catch (error) {
      message.error(t('common.delFailed'));
    }
  };

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    message.success(t('secret.copied'));
  };

  const handleCreate = () => {
    setGroupVisible(true);
  };

  const handleGroupSelect = async () => {
    if (!selectedGroup) return;

    setCreating(true);
    try {
      const data = await post('/base/user_api_secret/', { team: selectedGroup });
      const group = groups.find(group => group.id === selectedGroup);
      const newEntry = {
        id: data.id,
        api_secret: data.api_secret,
        created_at: data.created_at,
        team: selectedGroup,
        team_name: group ? group.name : undefined,
      };
      setDataSource([...dataSource, newEntry]);
      message.success(t('common.addSuccess'));
      setGroupVisible(false);
    } catch (error) {
      message.error(t('common.saveFailed'));
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
      title: t('secret.group'),
      dataIndex: 'team_name',
      key: 'team_name',
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
            title={t('secret.deleteConfirm')}
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
      width={800}
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
          disabled={creating || loading}
        >
          {creating ? <Spin /> : t('secret.create')}
        </Button>
      </div>
      <Modal
        visible={groupVisible}
        title={t('secret.selectGroup')}
        centered
        onCancel={() => setGroupVisible(false)}
        onOk={handleGroupSelect}
      >
        <Select
          style={{ width: '100%' }}
          placeholder={t('common.select')}
          onChange={setSelectedGroup}
        >
          {groups.map(group => (
            <Select.Option key={group.id} value={group.id} disabled={dataSource.some(item => item.team === group.id)}>
              {group.name}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </OperateModal>
  );
};

export default ConfigurationsModal;