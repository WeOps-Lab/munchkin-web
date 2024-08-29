'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Dropdown, Menu, Modal, message } from 'antd';
import Icon from '@/components/icon';
import { KnowledgeValues, Card } from '@/types/knowledge';
import ModifyKnowledgeModal from './modifyKnowledge';
import knowledgeStyle from './index.module.less';

const initialCards: Card[] = [
  {
    id: 1,
    title: 'How to use Next.js',
    description: 'A comprehensive guide on how to use Next.js.',
    owner: 'John Doe',
  },
  {
    id: 2,
    title: 'Understanding React Hooks',
    description: 'An introduction to React Hooks and their usage. An introduction to React Hooks and their usage. An introduction to React Hooks and their usage.',
    owner: 'Jane Smith',
  }
];

const iconTypes = ['zhishiku', 'zhishiku-red', 'zhishiku-blue', 'zhishiku-yellow', 'zhishiku-green'];

const getRandomIconType = () => {
  const randomIndex = Math.floor(Math.random() * iconTypes.length);
  return iconTypes[randomIndex];
};

const KnowledgePage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCard, setEditingCard] = useState<null | Card>(null); // 新增这个状态用于编辑

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddKnowledge = (values: KnowledgeValues) => {
    if (editingCard) {
      // 如果正在编辑，则更新现有卡片
      setCards(cards.map(card => card.id === editingCard.id ? { ...card, ...values } : card));
      message.success('Knowledge updated successfully');
    } else {
      // 否则新增卡片
      const newCard: Card = {
        id: cards.length + 1,
        title: values.name,
        description: values.introduction,
        owner: 'New Owner',
      };
      setCards([...cards, newCard]);
      message.success('Knowledge added successfully');
    }
    setIsModalVisible(false);
    setEditingCard(null); // 清空编辑状态
  };

  const handleDelete = (cardId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this knowledge?',
      onOk() {
        setCards(cards.filter(card => card.id !== cardId));
        message.success('Knowledge deleted successfully');
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
        Edit
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleMenuClick('delete', card)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  const filteredCards = cards.filter((card) =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-12 mx-auto">
      <div className="flex justify-end mb-4">
        <Input 
          size="large"
          placeholder="Search..."
          style={{ width: '350px' }}
          onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
        />
      </div>
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${knowledgeStyle.knowledge}`}>
        <div
          className={`p-4 rounded-xl flex items-center justify-center shadow-md cursor-pointer ${knowledgeStyle.add}`}
          onClick={() => { setIsModalVisible(true); setEditingCard(null); }} // 清空编辑状态
        >
          <Icon type="tianjia" className="text-2xl" />
          <span className="ml-2">Add New</span>
        </div>
        {filteredCards.map((card) => (
          <div
            key={card.id}
            className={`p-4 rounded-xl relative shadow-md cursor-pointer ${knowledgeStyle.card}`}
            onClick={() => router.push(`/knowledge/detail?id=${card.id}`)} // 跳转到详情页
          >
            <div className="absolute top-6 right-2" onClick={(e) => e.stopPropagation()}> {/* 阻止冒泡 */}
              <Dropdown overlay={menu(card)} trigger={['click']} placement="bottomRight">
                <div className="cursor-pointer">
                  <Icon type="sangedian-copy" className="text-xl" />
                </div>
              </Dropdown>
            </div>
            <div className="flex items-center mb-2">
              <div className="rounded-full">
                <Icon type={getRandomIconType()} className="text-4xl" />
              </div>
              <h3 className="ml-2 text-base font-semibold truncate" title={card.title}>
                {card.title}
              </h3>
            </div>
            <p className={`my-5 text-sm line-clamp-3 ${knowledgeStyle.desc}`}>{card.description}</p>
            <div className={`absolute bottom-4 right-4 text-xs ${knowledgeStyle.desc}`}>Owner: {card.owner}</div>
          </div>
        ))}
      </div>
      <ModifyKnowledgeModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={handleAddKnowledge}
        initialValues={editingCard ? { name: editingCard.title, group: 'group1', introduction: editingCard.description } : undefined} // 传递初始值
      />
    </div>
  );
};

export default KnowledgePage;