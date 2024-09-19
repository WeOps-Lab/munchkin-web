'use client';

import React, { useState } from 'react';
import { Row, Col, Input, Button, Card, Dropdown, Menu } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import styles from './index.module.less';

const { Search } = Input;
const { Meta } = Card;

const dummyData = [
  {
    skillName: 'Skill Name',
    description: '这里是Skill的描述，XXXXXXXXXXXXXXXXXXXXXX',
    owner: 'kayla',
    group: 'WeOps',
    avatar: 'https://via.placeholder.com/150',
  },
];

const SkillCard = ({ skillName, description, owner, group, avatar }) => {
  const menu = (
    <Menu>
      <Menu.Item key="edit">Edit</Menu.Item>
      <Menu.Item key="delete">Delete</Menu.Item>
    </Menu>
  );

  return (
    <Card
      className={styles.skillCard}
      cover={<img alt="avatar" src={avatar} className={styles.avatar} />}
      actions={[
        <Dropdown overlay={menu} trigger={['click']}>
          <EllipsisOutlined key="ellipsis" />
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

const HomePage: React.FC = () => {
  const [skills, setSkills] = useState(dummyData);

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
        {skills.map((skill, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <SkillCard {...skill} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default HomePage;