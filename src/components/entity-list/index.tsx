'use client';

import React, { useState, useEffect } from 'react';
import { Input, message, Spin, Modal } from 'antd';
import useApiClient from '@/utils/request';
import { useTranslation } from '@/utils/i18n';
import styles from '@/styles/common.less';

interface EntityListProps<T> {
  endpoint: string;
  CardComponent: React.FC<any>;
  ModifyModalComponent: React.FC<any>;
  itemType: string;
  itemTypeSingle: string;
  beforeDelete?: (item: T, deleteCallback: () => void) => void;
}

const EntityList = <T,>({ endpoint, CardComponent, ModifyModalComponent, itemType, itemTypeSingle, beforeDelete }: EntityListProps<T>) => {
  const { t } = useTranslation();
  const { get, post, patch, del } = useApiClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<T[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<null | T>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [get]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await get(endpoint);
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      message.error(t('common.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddItem = async (values: T) => {
    try {
      if (editingItem) {
        await patch(`${endpoint}${(editingItem as any).id}/`, values);
        fetchItems();
        message.success(t('common.updateSuccess'));
      } else {
        await post(endpoint, values);
        fetchItems();
        message.success(t('common.addSuccess'));
      }
      setIsModalVisible(false);
      setEditingItem(null);
    } catch (error) {
      message.error(t('common.saveFailed'));
    }
  };

  const handleDelete = async (item: T) => {
    if (beforeDelete) {
      beforeDelete(item, async () => {
        fetchItems();
      });
    } else {
      deleteItem(item);
    }
  };

  const deleteItem = async (item: T) => {
    Modal.confirm({
      title: t(`${itemTypeSingle}.deleteConfirm`),
      onOk: async () => {
        try {
          await del(`${endpoint}${(item as any).id}/`);
          fetchItems();
          message.success(t('common.delSuccess'));
        } catch (error) {
          message.error(t('common.delFailed'));
        }
      },
    });
  };

  const handleMenuClick = (action: string, item: T) => {
    if (action === 'edit') {
      setEditingItem(item);
      setIsModalVisible(true);
    } else if (action === 'delete') {
      handleDelete(item);
    }
  };

  const filteredItems = items.filter(item =>
    (item as any).name?.toLowerCase().includes(searchTerm.toLowerCase())
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
            onClick={() => { setIsModalVisible(true); setEditingItem(null); }}
          >
            <div className="text-center">
              <div className="text-2xl">+</div>
              <div className="mt-2">{t('common.addNew')}</div>
            </div>
          </div>
          {filteredItems.map((item, index) => (
            <CardComponent
              key={(item as any).id}
              {...item}
              index={index}
              onMenuClick={handleMenuClick}
            />
          ))}
        </div>
      </Spin>
      <ModifyModalComponent
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={handleAddItem}
        initialValues={editingItem}
      />
    </div>
  );
};

export default EntityList;
