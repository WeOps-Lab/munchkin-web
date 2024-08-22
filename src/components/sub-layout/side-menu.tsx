'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import sideMenuStyle from './index.module.less';

export interface MenuItem {
  label: string;
  path: string;
}

interface SideMenuProps {
  menuItems: MenuItem[];
}

const SideMenu: React.FC<SideMenuProps> = ({ menuItems }) => {
  const pathname = usePathname();

  return (
    <aside className={`w-[216px] border-r pr-4 flex flex-col ${sideMenuStyle.sideMenu}`}>
      <div className="p-4 text-gray-600">
        <h2 className="text-lg font-semibold">Menu Introduction</h2>
        <p className="text-sm">This is a brief introduction about the menu.</p>
      </div>
      <nav className={`flex-1 rounded-md ${sideMenuStyle.nav}`}>
        <ul className="p-3">
          {menuItems.map((item) => (
            <li key={item.path} className={`rounded-md mb-1 ${pathname === item.path ? sideMenuStyle.active : ''}`}>
              <Link legacyBehavior href={item.path}>
                <a className={`group flex items-center h-9 rounded-md py-2 text-sm font-normal px-3`}>{item.label}</a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SideMenu;
