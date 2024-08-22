import React from 'react';
import WithSideMenuLayout from '@/components/sub-layout';

const menuItems = [
  { label: 'Document', path: '/about/document' },
  { label: 'System', path: '/about/system' },
];

const AboutLayout = ({ children }: { children: React.ReactNode }) => {
  return <WithSideMenuLayout menuItems={menuItems}>{children}</WithSideMenuLayout>;
};

export default AboutLayout;
