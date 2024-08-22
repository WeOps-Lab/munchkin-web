import React from 'react';
import SideMenu, { MenuItem } from './side-menu';

interface WithSideMenuLayoutProps {
  menuItems: MenuItem[];
  children: React.ReactNode;
}

const WithSideMenuLayout: React.FC<WithSideMenuLayoutProps> = ({ menuItems, children }) => {
  return (
    <div className="flex h-full grow">
      <SideMenu menuItems={menuItems} />
      <section className="p-4">
        {children}
      </section>
    </div>
  );
};

export default WithSideMenuLayout;
