'use client';

import React, { useState, useEffect } from 'react';
import { Input, Modal, message, Spin } from 'antd';
import useApiClient from '@/utils/request';
import ModifyStudioModal from './modifyStudioModal';
import StudioCard from '@/components/studio/studioCard';
import { useTranslation } from '@/utils/i18n';
import styles from '@/styles/common.less';
import { Studio } from '@/types/studio';

const StudioPage: React.FC = () => {
  const { t } = useTranslation();
  const { get, post, patch, del } = useApiClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStudios, setEditingStudios] = useState<null | Studio>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudios();
  }, [get]);

  const fetchStudios = async () => {
    setLoading(true);
    try {
      const data = await get('/bot_mgmt/bot/');
      setStudios(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error(t('common.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddStudio = async (values: Studio) => {
    try {
      if (editingStudios) {
        await patch(`/bot_mgmt/bot/${editingStudios.id}/`, values);
        setStudios(studios.map(studio => studio.id === editingStudios.id ? { ...studio, ...values } : studio));
        message.success(t('common.updateSuccess'));
      } else {
        await post('/bot_mgmt/bot/', values);
        fetchStudios();
        message.success(t('common.addSuccess'));
      }
      setIsModalVisible(false);
      setEditingStudios(null);
    } catch (error) {
      message.error(t('common.saveFailed'));
    }
  };

  const deleteBot = async (studio: Studio) => {
    try {
      await del(`/bot_mgmt/bot/${studio.id}/`);
      setStudios(studios.filter(item => item.id !== studio.id));
      message.success(t('common.delSuccess'));
    } catch (error) {
      message.error(t('common.delFailed'));
    }
  }

  const handleDelete = (studio: Studio) => {
    if (studio.status === 'online') {
      Modal.confirm({
        title: t('studio.offDeleteConfirm'),
        okText: t('studio.offAndDel'),
        onOk: () => {
          deleteBot(studio);
        }
      });
    } else {
      Modal.confirm({
        title: t('studio.deleteConfirm'),
        onOk: () => {
          deleteBot(studio);
        }
      });
    }
  };

  const handleMenuClick = (action: string, studio: Studio) => {
    if (action === 'edit') {
      setEditingStudios(studio);
      setIsModalVisible(true);
    } else if (action === 'delete') {
      handleDelete(studio);
    }
  };

  const filteredStudios = studios.filter(studio =>
    studio.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-12 w-full min-h-screen">
      <div className="flex justify-end mb-4">
        <Input 
          size="large"
          placeholder={`${t('common.search')}...`}
          style={{ width: '350px' }}
          onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
        />
      </div>
      <Spin spinning={loading}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            className={`shadow-md p-4 rounded-xl flex items-center justify-center cursor-pointer ${styles.addNew}`}
            onClick={() => { setIsModalVisible(true); setEditingStudios(null); }}
          >
            <div className="text-center">
              <div className="text-2xl">+</div>
              <div className="mt-2">{t('common.addNew')}</div>
            </div>
          </div>
          {filteredStudios.map((studio, index) => (
            <StudioCard 
              key={studio.id} 
              {...studio} 
              index={index} 
              onMenuClick={handleMenuClick} 
            />
          ))}
        </div>
      </Spin>
      <ModifyStudioModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={handleAddStudio}
        initialValues={editingStudios}
      />
    </div>
  );
};

export default StudioPage;