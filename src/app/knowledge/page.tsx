'use client';

import React, { useState } from 'react';
import { Input, Dropdown, Menu } from 'antd';
import { FileAddOutlined, BookOutlined, MoreOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import Icon from '@/components/icon';
import knowledgeStyle from './index.module.less'

const { Search } = Input;

interface Card {
  id: number;
  title: string;
  description: string;
  owner: string;
}

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
  },
  {
    id: 3,
    title: 'Understanding React Hooks',
    description: 'An introduction to React Hooks and their usage. An introduction to React Hooks and their usage. An introduction to React Hooks and their usage.',
    owner: 'Jane Smith',
  },
  {
    id: 4,
    title: 'Understanding React Hooks',
    description: 'An introduction to React Hooks and their usage. An introduction to React Hooks and their usage. An introduction to React Hooks and their usage.',
    owner: 'Jane Smith',
  },
];

const getRandomColorClass = () => {
  const colors = ['bg-purple-100', 'bg-blue-100', 'bg-orange-100'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const KnowledgePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cards, setCards] = useState<Card[]>(initialCards);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleMenuClick = (action: string, cardId: number) => {
    if (action === 'settings') {
      console.log(`Settings for card ${cardId}`);
    } else if (action === 'delete') {
      setCards(cards.filter(card => card.id !== cardId));
    }
  };

  const menu = (cardId: number) => (
    <Menu>
      <Menu.Item key="settings" onClick={() => handleMenuClick('settings', cardId)}>
        Settings
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleMenuClick('delete', cardId)}>
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
        <Search
          placeholder="Search..."
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${knowledgeStyle.knowledge}`}>
        <div className={`p-4 rounded flex items-center justify-center shadow-md ${knowledgeStyle.add}`}>
          <FileAddOutlined />
          <Icon type="zhishiku" className="text-2xl" />
          <span className="ml-2">Add New</span>
        </div>
        {filteredCards.map((card) => (
          <div key={card.id} className={`p-4 rounded relative shadow-md ${knowledgeStyle.card}`}>
            <div className="absolute top-4 right-2">
              <Dropdown overlay={menu(card.id)} trigger={['click']}>
                <MoreOutlined className="cursor-pointer" />
              </Dropdown>
            </div>
            <div className="flex items-center mb-2">
              <div className={classNames('rounded-full py-1 px-2', getRandomColorClass())}>
                <BookOutlined />
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
    </div>
  );
};

export default KnowledgePage;