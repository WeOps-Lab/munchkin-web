import React, { useState } from 'react';
import { Dropdown, Space, Menu, Avatar } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import { DownOutlined } from '@ant-design/icons';
import SettingsModal from './settings';
import ConfigurationsModal from './configurations';
import { useTranslation } from '@/utils/i18n';

const UserInfo = () => {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const username = session?.username || 'Qiu-Jia';
  const [visible, setVisible] = useState<boolean>(false);
  const [configurationsVisible, setConfigurationsVisible] = useState<boolean>(false);

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleSettings = () => {
    setVisible(true);
  };

  const handleConfigurations = () => {
    setConfigurationsVisible(true);
  };


  const items: Array<{ label: JSX.Element; key: string } | { type: 'divider' }> = [
    {
      label: <a onClick={handleConfigurations}>{t('secret.menu')}</a>,
      key: '0',
    },
    {
      type: 'divider',
    },
    {
      label: <a onClick={handleSettings}>Settings</a>,
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: <a onClick={handleLogout}>{t('common.logout')}</a>,
      key: '2',
    },
  ];

  return (
    <div>
      {username && (
        <Dropdown overlay={<Menu items={items} />} trigger={['click']}>
          <a className='cursor-pointer' onClick={(e) => e.preventDefault()}>
            <Space className='text-sm'>
              <Avatar 
                size={20}
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  verticalAlign: 'middle' 
                }}>
                {username.charAt(0).toUpperCase()}
              </Avatar>
              {username}
              <DownOutlined style={{ fontSize: '10px' }} />
            </Space>
          </a>
        </Dropdown>
      )}
      <SettingsModal 
        visible={visible} 
        onClose={() => setVisible(false)} />
      <ConfigurationsModal 
        visible={configurationsVisible} 
        onClose={() => setConfigurationsVisible(false)} />
    </div>
  );
};

export default UserInfo;
