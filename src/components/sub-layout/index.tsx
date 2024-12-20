'use client';

import React, { useState, useEffect } from 'react';
import SideMenu, { MenuItem } from './side-menu';
import sideMenuStyle from './index.module.less';
import styles from '@/styles/common.less';
import { Segmented } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/icon';

interface WithSideMenuLayoutProps {
  menuItems: MenuItem[];
  intro?: React.ReactNode;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
  children: React.ReactNode;
  topSection?: React.ReactNode;
  showProgress?: boolean;
  layoutType?: 'sideMenu' | 'segmented';
}

const WithSideMenuLayout: React.FC<WithSideMenuLayoutProps> = ({
  menuItems,
  intro,
  showBackButton,
  onBackButtonClick,
  children,
  topSection,
  showProgress,
  layoutType = 'sideMenu',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState<string>(pathname);

  useEffect(() => {
    setSelectedKey(pathname);
  }, [pathname]);

  const handleSegmentChange = (key: string | number) => {
    router.push(key as string);
    setSelectedKey(key as string);
  };

  return (
    <div className={`flex grow w-full h-full ${sideMenuStyle.sideMenuLayout}`}>
      {layoutType === 'sideMenu' ? (
        <>
          <SideMenu
            menuItems={menuItems}
            showBackButton={showBackButton}
            showProgress={showProgress}
            onBackButtonClick={onBackButtonClick}
          >
            {intro}
          </SideMenu>
          <section className="flex-1 flex flex-col overflow-hidden">
            {topSection && (
              <div className={`mb-3 w-full rounded-md ${sideMenuStyle.sectionContainer}`}>
                {topSection}
              </div>
            )}
            <div className={`p-4 flex-1 rounded-md overflow-auto ${sideMenuStyle.sectionContainer} ${sideMenuStyle.sectionContext}`}>
              {children}
            </div>
          </section>
        </>
      ) : (
        <div className={`flex flex-col w-full h-full ${styles.segmented}`}>
          <Segmented
            options={menuItems.map(item => ({
              label: (
                <div className="flex items-center justify-center">
                  <Icon type={item.icon} className="mr-2 text-sm" /> {item.label}
                </div>
              ),
              value: item.path,
            }))}
            value={selectedKey}
            onChange={handleSegmentChange}
          />
          <div className="flex-1 pt-4 rounded-md overflow-auto">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default WithSideMenuLayout;
