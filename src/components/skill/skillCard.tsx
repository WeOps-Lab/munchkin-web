'use client';

import React from 'react';
import { Card, Dropdown, Menu } from 'antd';
import { useRouter } from 'next/navigation';
import Icon from '@/components/icon';
import Image from 'next/image';
import { Skill } from '@/types/skill';
import styles from './index.module.less'
import { useTranslation } from '@/utils/i18n';

const { Meta } = Card;

interface SkillCardProps extends Skill {
  index: number;
  onMenuClick: (action: string, skill: Skill) => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ id, skillName, description, owner, group, avatar, index, onMenuClick }) => {
  const router = useRouter();
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

  const iconType = index % 2 === 0 ? 'jishuqianyan' : 'theory';

  return (
    <Card 
      className={`shadow-md rounded-xl relative overflow-hidden ${styles.skillCard}`} 
      onClick={() => router.push(`/skill/settings?id=${id}&name=${skillName}&desc=${description}`)}>
      <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
        <Dropdown overlay={menu} trigger={['click']} key={`dropdown-${id}`} placement="bottomRight">
          <div className="cursor-pointer">
            <Icon type="sangedian-copy" className="text-xl" />
          </div>
        </Dropdown>
      </div>
      <div className="w-full h-[60px] relative">
        <Image alt="avatar" src={avatar} layout="fill" objectFit="cover" className="rounded-t-xl" />
      </div>
      <div className={`w-[40px] h-[40px] rounded-full flex justify-center items-center ${styles.iconContainer}`}>
        <Icon type={iconType} className="text-2xl" />
      </div>
      <div className="p-4">
        <Meta
          title={skillName}
          description={
            <>
              <p className={`my-5 text-sm line-clamp-3 h-[60px] ${styles.desc}`}>{description}</p>
              <div className={`absolute bottom-4 right-4 text-xs ${styles.desc}`}>
                <span className="pr-5">{t('skill.form.owner')}: {owner}</span>
                <span>{t('skill.form.group')}: {group}</span>
              </div>
            </>
          }
        />
      </div>
    </Card>
  );
};

export default SkillCard;