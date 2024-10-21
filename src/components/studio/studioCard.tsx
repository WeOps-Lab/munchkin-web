import React from 'react';
import { Card, Dropdown, Menu, Tag } from 'antd';
import { useRouter } from 'next/navigation';
import Icon from '@/components/icon';
import Image from 'next/image';
import { Studio } from '@/types/studio';
import styles from '@/styles/common.less';
import studioStyles from './index.module.less';
import { useTranslation } from '@/utils/i18n';

const { Meta } = Card;

interface StudioCardProps extends Studio {
  index: number;
  onMenuClick: (action: string, studio: Studio) => void;
}

const StudioCard: React.FC<StudioCardProps> = ({ id, name, introduction, created_by, team, team_name, index, online, onMenuClick }) => {
  const router = useRouter();
  const { t } = useTranslation();

  const menu = (
    <Menu>
      <Menu.Item key={`edit-${id}`} onClick={() => onMenuClick('edit', { id, name, introduction, created_by, team_name, team, online })}>
        {t('common.edit')}
      </Menu.Item>
      <Menu.Item key={`delete-${id}`} onClick={() => onMenuClick('delete', { id, name, introduction, created_by, team_name, team, online })}>
        {t('common.delete')}
      </Menu.Item>
    </Menu>
  );

  const iconType = index % 2 === 0 ? 'jiqirenjiaohukapian' : 'jiqiren';
  const avatar = index % 2 === 0 ? '/banner_bg_1.jpg' : '/banner_bg_2.jpg';

  return (
    <Card 
      className={`shadow-md cursor-pointer rounded-xl relative overflow-hidden ${styles.CommonCard}`} 
      onClick={() => router.push(`/studio/detail/settings?id=${id}&name=${name}&desc=${introduction}`)}
    >
      <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
        <Dropdown overlay={menu} trigger={['click']} key={`dropdown-${id}`} placement="bottomRight">
          <div className="cursor-pointer">
            <Icon type="sangedian-copy" className="text-xl"/>
          </div>
        </Dropdown>
      </div>
      <div className="w-full h-[60px] relative">
        <Image alt="avatar" src={avatar} layout="fill" objectFit="cover" className="rounded-t-xl" />
      </div>
      <div className={`w-[50px] h-[50px] rounded-full flex justify-center items-center ${styles.iconContainer}`}>
        <Icon type={iconType} className="text-4xl" />
      </div>
      <div className="p-4 relative">
        <Meta
          title={name}
          description={
            <>
              <p className={`my-5 text-sm line-clamp-3 h-[60px] ${styles.desc}`}>{introduction}</p>
              <div className={`flex items-center justify-between ${studioStyles.footer}`}>
                <Tag
                  color={online ? 'green' : ''}
                  className={`${styles.statusTag} ${online ? styles.online : styles.offline}`}>
                  {online ? t('studio.on') : t('studio.off')}
                </Tag>
                <div className={studioStyles.info}>
                  <span className="pr-5">{t('skill.form.owner')}: {created_by}</span>
                  <span>{t('skill.form.group')}: {Array.isArray(team_name) ? team_name.join(',') : '--'}</span>
                </div>
              </div>
            </>
          }
        />
      </div>
    </Card>
  );
};

export default StudioCard;