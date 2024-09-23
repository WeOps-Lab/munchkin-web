'use client';

import React from 'react';
import { Card, Dropdown, Menu } from 'antd';
import Icon from '@/components/icon';
import Image from 'next/image';
import { Skill } from '@/types/skill';
import styles from './index.module.less'
import { useTranslation } from '@/utils/i18n';

const { Meta } = Card;

interface SkillCardProps extends Skill {
  onMenuClick: (action: string, skill: Skill) => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ id, skillName, description, owner, group, avatar, onMenuClick }) => {
    const { t } = useTranslation();
    const menu = (
    <Menu>
      <Menu.Item key={`edit-${id}`} onClick={() => onMenuClick('edit', { id, skillName, description, owner, group, avatar })}>
        Edit
      </Menu.Item>
      <Menu.Item key={`delete-${id}`} onClick={() => onMenuClick('delete', { id, skillName, description, owner, group, avatar })}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <Card className={`shadow-md rounded-xl relative overflow-hidden ${styles.skillCard}`}>
      <div className="absolute top-2 right-2 z-10">
        <Dropdown overlay={menu} trigger={['click']} key={`dropdown-${id}`} placement="bottomRight">
          <div className="cursor-pointer">
            <Icon type="sangedian-copy" className="text-xl" />
          </div>
        </Dropdown>
      </div>
      <div className="w-full h-20 relative">
        <Image alt="avatar" src={avatar} layout="fill" objectFit="cover" className="rounded-t-xl" />
      </div>
      <div className="p-4">
        <Meta
          title={skillName}
          description={
            <>
              <p className={`my-5 text-sm line-clamp-3 h-[80px] ${styles.desc}`}>{description}</p>
              <div className={`absolute bottom-4 right-4 text-xs ${styles.desc}`}>
                <span className="pr-5">{t('knowledge.form.owner')}: {owner}</span>
                <span>{t('knowledge.form.group')}: {group}</span>
              </div>
            </>
          }
        />
      </div>
    </Card>
  );
};

export default SkillCard;