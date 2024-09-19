'use client';

import React from 'react';
import { Row, Col, Input, Button, Card, Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import Image from 'next/image';
import styles from './index.module.less';

const { Search } = Input;
const { Meta } = Card;

interface Skill {
  id: number;
  skillName: string;
  description: string;
  owner: string;
  group: string;
  avatar: string;
}

const dummyData: Skill[] = [
  {
    id: 1,
    skillName: 'Skill Name',
    description: '这里是Skill的描述，XXXXXXXXXXXXXXXXXXXXXX',
    owner: 'kayla',
    group: 'WeOps',
    avatar: 'https://via.placeholder.com/150',
  },
];

const SkillCard: React.FC<Skill> = ({ id, skillName, description, owner, group, avatar }) => {
  const menu = (
    <Menu>
      <Menu.Item key={`edit-${id}`}>Edit</Menu.Item>
      <Menu.Item key={`delete-${id}`}>Delete</Menu.Item>
    </Menu>
  );

  return (
    <Card
      className={styles.skillCard}
      cover={<Image alt="avatar" src={avatar} width={150} height={150} className={styles.avatar} />}
      actions={[
        <Dropdown overlay={menu} trigger={['click']} key={`dropdown-${id}`}>
          <EllipsisOutlined key={`ellipsis-${id}`} />
        </Dropdown>,
      ]}
    >
      <Meta
        title={skillName}
        description={
          <>
            <p>{description}</p>
            <div className={styles.metaInfo}>
              <span>Owner: {owner}</span>
              <span>Group: {group}</span>
            </div>
          </>
        }
      />
    </Card>
  );
};

const SkillPage: React.FC = () => {
  const skills: Skill[] = dummyData;

  const handleSearch = (value: string) => {
    console.log('Search:', value);
  };

  return (
    <div className={styles.skillList}>
      <div className={styles.searchContainer}>
        <Search placeholder="Search..." onSearch={handleSearch} style={{ width: 300 }} />
        <Button type="dashed" className={styles.addButton}>
          + Add
        </Button>
      </div>
      <Row gutter={[16, 16]}>
        {skills.map((skill) => (
          <Col key={skill.id} xs={24} sm={12} md={8} lg={6}>
            <SkillCard {...skill} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default SkillPage;