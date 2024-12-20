import React, { useState, useEffect } from 'react';
import { Dropdown, Space, Menu, Avatar, MenuProps } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import Theme from '@/components/theme';
import { DownOutlined, RetweetOutlined } from '@ant-design/icons';
import { useTranslation } from '@/utils/i18n';
import useApiClient from '@/utils/request';
import VersionModal from './versionModal';
import { groupProps } from '@/types/global';
import Cookies from 'js-cookie';

const UserInfo = () => {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const { get } = useApiClient();
  const username = session?.username || 'Qiu-Jia';
  const [myGroups, setMyGroups] = useState<groupProps[]>([]);
  const [versionVisible, setVersionVisible] = useState<boolean>(false);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(undefined);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchMyGroups();
  }, []);

  const fetchMyGroups = async () => {
    const data = await get('/core/login_info/');
    const { group_list: groupList } = data
    if(!groupList?.length) return;
    setMyGroups(groupList);
    const groupIdFromCookie = Cookies.get('current_team');
    if (groupIdFromCookie && groupIdFromCookie !== 'undefined') {
      const selectedGroupObj = groupList.find((group: any) => group.id === groupIdFromCookie);
      if (selectedGroupObj) {
        setSelectedGroup(selectedGroupObj.name);
      } else {
        setSelectedGroup(groupList?.[0]?.name);
        Cookies.set('current_team', groupList?.[0]?.id);
      }
    } else {
      setSelectedGroup(groupList?.[0]?.name);
      Cookies.set('current_team', groupList?.[0]?.id);
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleVersion = () => {
    setVersionVisible(true);
  };

  const handleChangeGroup = () => {
    if (myGroups?.length) {
      const currentIndex = myGroups.findIndex(group => group.name === selectedGroup);
      const nextIndex = (currentIndex + 1) % myGroups.length;
      const nextGroup = myGroups[nextIndex];
      setSelectedGroup(nextGroup.name);
      Cookies.set('current_team', nextGroup.id);
    }
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '3') {
      handleChangeGroup();
      setDropdownVisible(true);
      return;
    }
    setDropdownVisible(false);
  };

  const items: Array<{ label: JSX.Element | string; key: string, extra?: string | JSX.Element } | { type: 'divider' }> = [
    {
      key: '3',
      label: `${t('common.group')}`,
      extra: <div><a className="mr-2" onClick={handleChangeGroup}>{selectedGroup}</a><RetweetOutlined /></div>,
    },
    {
      key: '1',
      label: <a onClick={handleVersion}>{t('common.version')}</a>,
      extra: '3.1.0',
    },
    {
      type: 'divider',
    },
    {
      label: <a onClick={handleLogout}>{t('common.logout')}</a>,
      key: '2',
    }
  ];

  return (
    <div className='flex'>
      {username && (
        <Dropdown
          overlay={<Menu onClick={handleMenuClick} items={items} />}
          trigger={['click']}
          visible={dropdownVisible}
          onVisibleChange={setDropdownVisible}
          overlayClassName="w-[160px]">
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
      <VersionModal
        visible={versionVisible}
        onClose={() => setVersionVisible(false)} />
    </div>
  );
};

export default UserInfo;
