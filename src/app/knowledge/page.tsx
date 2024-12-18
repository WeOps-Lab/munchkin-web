'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Dropdown, Menu, Modal, message, Spin } from 'antd';
import Icon from '@/components/icon';
import { KnowledgeValues, Card } from '@/types/knowledge';
import ModifyKnowledgeModal from './modifyKnowledge';
import knowledgeStyle from './index.module.less';
import useApiClient from '@/utils/request';
import { useTranslation } from '@/utils/i18n';
import { getIconTypeByIndex } from '@/utils/knowledgeBaseUtils';

const KnowledgePage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { get, post, patch, del } = useApiClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCard, setEditingCard] = useState<null | KnowledgeValues>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getKnowledgeBase = async () => {
      setLoading(true);
      try {
        const data = await get('/knowledge_mgmt/knowledge_base/');
        setCards(Array.isArray(data) ? data : []);
      } catch (error) {
        message.error(t('common.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    getKnowledgeBase();
  }, [get]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddKnowledge = async (values: KnowledgeValues) => {
    try {
      if (editingCard) {
        await patch(`/knowledge_mgmt/knowledge_base/${editingCard.id}/`, values);
        setCards(cards.map(card => card.id === editingCard?.id ? { ...card, ...values } : card));
        message.success(t('common.updateSuccess'));
      } else {
        const newCard = await post('/knowledge_mgmt/knowledge_base/', values);
        setCards([newCard, ...cards]);
        message.success(t('common.addSuccess'));
      }
      setIsModalVisible(false);
      setEditingCard(null);
    } catch (error) {
      message.error(t('common.saveFailed'));
    }
  };

  const handleDelete = (cardId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this knowledge?',
      onOk: async () => {
        try {
          await del(`/knowledge_mgmt/knowledge_base/${cardId}/`);
          setCards(cards.filter(card => card.id !== cardId));
          message.success(t('common.delSuccess'));
        } catch (error) {
          message.error(t('common.delFailed'));
        }
      },
    });
  };

  const handleMenuClick = (action: string, card: Card) => {
    if (action === 'edit') {
      setEditingCard(card);
      setIsModalVisible(true);
    } else if (action === 'delete') {
      handleDelete(card.id);
    }
  };

  const menu = (card: Card) => (
    <Menu>
      <Menu.Item key="edit" onClick={() => handleMenuClick('edit', card)}>
        {t('common.edit')}
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleMenuClick('delete', card)}>
        {t('common.delete')}
      </Menu.Item>
    </Menu>
  );

  const filteredCards = cards.filter((card) =>
    card.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-12 w-full">
      <div className="flex justify-end mb-4">
        <Input
          size="large"
          placeholder={`${t('common.search')}...`}
          style={{ width: '350px' }}
          onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
        />
      </div>
      <Spin spinning={loading}>
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${knowledgeStyle.knowledge}`}>
          <div
            className={`p-4 rounded-xl flex items-center justify-center shadow-md cursor-pointer ${knowledgeStyle.add}`}
            onClick={() => { setIsModalVisible(true); setEditingCard(null); }}
          >
            <Icon type="tianjia" className="text-2xl" />
            <span className="ml-2">{t('common.addNew')}</span>
          </div>
          {filteredCards.map((card, index) => (
            <div
              key={card.id}
              className={`p-4 rounded-xl relative shadow-md cursor-pointer ${knowledgeStyle.card}`}
              onClick={() => router.push(`/knowledge/detail?id=${card.id}&name=${card.name}&desc=${card.introduction}`)}
            >
              <div className="absolute top-6 right-2" onClick={(e) => e.stopPropagation()}>
                <Dropdown overlay={menu(card)} trigger={['click']} placement="bottomRight">
                  <div className="cursor-pointer">
                    <Icon type="sangedian-copy" className="text-xl" />
                  </div>
                </Dropdown>
              </div>
              <div className="flex items-center mb-2">
                <div className="rounded-full">
                  <Icon type={getIconTypeByIndex(index)} className="text-4xl" />
                </div>
                <h3 className="ml-2 text-base font-semibold truncate" title={card.name}>
                  {card.name}
                </h3>
              </div>
              <p className={`my-5 text-sm line-clamp-3 ${knowledgeStyle.desc}`}>{card.introduction}</p>
              <div className={`absolute bottom-4 right-4 text-xs ${knowledgeStyle.desc}`}>
                <span className="pr-5">{t('knowledge.form.owner')}: {card.created_by}</span>
                <span>{t('knowledge.form.group')}: {Array.isArray(card.team_name) ? card.team_name.join(',') : '--'}</span>
              </div>
            </div>
          ))}
        </div>
      </Spin>
      <ModifyKnowledgeModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={handleAddKnowledge}
        initialValues={editingCard}
        isTraining={editingCard?.is_training || false}
      />
    </div>
  );
};

export default KnowledgePage;
