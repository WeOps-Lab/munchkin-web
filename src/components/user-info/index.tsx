import React, { useState } from 'react';
import { Dropdown, Space, Menu, Avatar } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import Theme from '@/components/theme';
import { DownOutlined } from '@ant-design/icons';
import ConfigurationsModal from './configurations';
import { useTranslation } from '@/utils/i18n';
import VersionModal from './versionModal';

const UserInfo = () => {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const username = session?.username || 'Qiu-Jia';
  const [configurationsVisible, setConfigurationsVisible] = useState<boolean>(false);
  const [versionVisible, setVersionVisible] = useState<boolean>(false);

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleConfigurations = () => {
    setConfigurationsVisible(true);
  };

  const handleVersion = () => {
    setVersionVisible(true);
  }

  const items: Array<{ label: JSX.Element; key: string, extra?: string } | { type: 'divider' }> = [
    {
      key: '1',
      label: <a onClick={handleVersion}>{t('common.version')}</a>,
      extra: '3.1.0',
    },
    {
      label: <a onClick={handleConfigurations}>{t('secret.menu')}</a>,
      key: '0',
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
    <div className='flex'>
      {username && (
        <Dropdown overlay={<Menu items={items} />} trigger={['click']} overlayClassName="w-[150px]">
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
      <Theme />
      <ConfigurationsModal
        visible={configurationsVisible}
        onClose={() => setConfigurationsVisible(false)} />
      <VersionModal
        visible={versionVisible}
        onClose={() => setVersionVisible(false)} />
    </div>
  );
};

export default UserInfo;
