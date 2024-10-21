'use client';

import React, { useEffect, useState } from 'react';
import { Modal, Input, Switch, Tag, Button, Form, Spin, message } from 'antd';
import Icon from '@/components/icon';
import styles from '@/styles/common.less';
import { useTranslation } from '@/utils/i18n';
import useApiClient from '@/utils/request';
import { ChannelProps } from '@/types/studio';

const ChannelPage: React.FC = () => {
  const { t } = useTranslation();
  const { get, patch } = useApiClient();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentApp, setCurrentApp] = useState<Partial<ChannelProps>>({});
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [apps, setApps] = useState<ChannelProps[]>([]);
  const [currentChannelType, setCurrentChannelType] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await get('/channel_mgmt/channel/');
      const appsData = data.map((channel: any) => ({
        id: channel.id,
        name: channel.name,
        enabled: channel.enabled,
        icon: channel.channel_type === 'enterprise_wechat' ? 'qiwei' : channel.channel_type === 'ding_talk' ? 'dingding1' : 'wangye',
        channel_config: channel.channel_config,
      }));
      setApps(appsData);
    } catch {
      message.error(t('common.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [get]);

  const handleOpenModal = (app: ChannelProps) => {
    setCurrentApp(app);
    setOpen(app.enabled);
    setCurrentChannelType(Object.keys(app.channel_config)[0]);

    setFormLoading(true);
    const fetchedFields = { ...app.channel_config[Object.keys(app.channel_config)[0]] };
    setFields(fetchedFields); // Ensure we keep the default values
    setFormLoading(false);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setCurrentApp({});
    setFields({});
  };

  const handleConfirmModal = async () => {
    const updatedConfig = {
      enabled: open,
      channel_config: {
        [currentChannelType]: fields,
      },
    };

    try {
      await patch(`/channel_mgmt/channel/${currentApp.id}/`, updatedConfig);
      message.success(t('common.success'));
      handleCloseModal();
      await fetchData();
    } catch (error) {
      message.error(t('common.error'));
      console.error('Failed to update channel config:', error);
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setOpen(checked);
  };

  const sensitiveKeys = ['client_secret', 'aes_key', 'secret', 'token'];

  return (
    <div className="flex flex-wrap justify-around">
      {loading ? (
        <Spin size="large" className="m-auto" />
      ) : (
        apps.map((app) => (
          <div key={app.id} className="w-full sm:w-1/3 p-4">
            <div
              className='shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out rounded-lg p-4 relative cursor-pointer group'
              style={{ background: "var(--color-fill-1)" }}
            >
              <div className="absolute top-2 right-2">
                <Tag
                  color={app.enabled ? 'green' : ''}
                  className={`${styles.statusTag} ${app.enabled ? styles.online : styles.offline}`}
                >
                  {app.enabled ? 'Opened' : 'Closed'}
                </Tag>
              </div>
              <div className="flex justify-center items-center space-x-4 my-5">
                <Icon type={app.icon} className="text-6xl" />
                <h2 className="text-xl font-bold m-0">{app.name}</h2>
              </div>
              <div className="w-full h-[32px] flex justify-center items-end">
                <Button
                  type="primary"
                  className="w-full rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(app);
                  }}
                >
                  <Icon type="shezhi" /> {t('studio.channel.setting')}
                </Button>
              </div>
            </div>
          </div>
        ))
      )}

      <Modal 
        title={t('studio.channel.setting')}
        visible={isModalVisible} 
        onCancel={handleCloseModal} 
        footer={[
          <Button key="cancel" onClick={handleCloseModal}>{t('common.cancel')}</Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmModal}>{t('common.confirm')}</Button>,
        ]}
        width={800}
      >
        {formLoading ? (
          <div className="flex items-center">
            <Spin size="large" className="m-auto" />
          </div>
        ) : (
          <Form layout="horizontal" labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} style={{ padding: '16px 0' }}>
            <Form.Item label="Open">
              <Switch size="small" checked={open} onChange={handleSwitchChange} />
            </Form.Item>
            {Object.keys(fields).map((key) => (
              <Form.Item key={key} label={key.replace(/_/g, ' ')}>
                {sensitiveKeys.some(sensitiveKey => key.toLowerCase().includes(sensitiveKey)) ? (
                  <Input.Password 
                    value={fields[key]} 
                    visibilityToggle={false} 
                    onChange={(e) => setFields({ ...fields, [key]: e.target.value })} 
                    onFocus={() => setFields({ ...fields, [key]: '' })}
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()} 
                    autoComplete="new-password"
                  />
                ) : (
                  <Input 
                    value={fields[key]} 
                    onChange={(e) => setFields({ ...fields, [key]: e.target.value })} 
                    autoComplete="off"
                  />
                )}
              </Form.Item>
            ))}
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default ChannelPage;