'use client';

import React from 'react';
import WithSideMenuLayout from '@/components/sub-layout';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTranslation } from '@/utils/i18n';

const KnowledgeDetailLayout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const id = searchParams.get('id');
  const name = searchParams.get('name');
  const desc = searchParams.get('desc');


  const handleBackButtonClick = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length >= 3) {
      if (pathSegments.length === 3) {
        router.push('/knowledge');
      } else if (pathSegments.length > 3) {
        router.push(`/knowledge/detail?id=${id}&name=${name}&desc=${desc}`);
      }
    } 
    else {
      router.back();
    }
  };

  const menuItems = [
    { label: t('knowledge.documents.title'), path: '/knowledge/detail/documents', icon: 'shiyongwendang' },
    { label: t('knowledge.testing.title'), path: '/knowledge/detail/testing', icon: 'ceshi' },
    { label: t('knowledge.settings.title'), path: '/knowledge/detail/settings', icon: 'shezhi' },
  ];

  const intro = (
    <div>
      <h2 className="text-lg font-semibold mb-2">{name}</h2>
      <p className="text-sm">{desc}</p>
    </div>
  );

  const getTopSectionContent = () => {
    switch (pathname) {
      case '/knowledge/detail/documents':
        return (
          <>
            <h2 className="text-lg font-semibold mb-2">{t('knowledge.documents.title')}</h2>
            <p className="truncate max-w-full" title={t('knowledge.documents.description')}>{t('knowledge.documents.description')}</p>
          </>
        );
      case '/knowledge/detail/testing':
        return (
          <>
            <h2 className="text-lg font-semibold mb-2">{t('knowledge.testing.title')}</h2>
            <p className="truncate max-w-full" title={t('knowledge.testing.description')}>{t('knowledge.testing.description')}</p>
          </>
        );
      case '/knowledge/detail/settings':
        return (
          <>
            <h2 className="text-lg font-semibold mb-2">{t('knowledge.settings.title')}</h2>
            <p className="truncate max-w-full" title={t('knowledge.settings.description')}>{t('knowledge.settings.description')}</p>
          </>
        );
      default:
        return (
          <>
            <h2 className="text-lg font-semibold mb-2">{t('knowledge.documents.title')}</h2>
            <p className="truncate max-w-full" title={t('knowledge.documents.description')}>{t('knowledge.documents.description')}</p>
          </>
        );
    }
  };

  const TopSection = () => (
    <div className="p-4 rounded-md w-full h-[95px]">
      {getTopSectionContent()}
    </div>
  );

  return (
    <WithSideMenuLayout
      menuItems={menuItems}
      topSection={<TopSection />}
      intro={intro}
      showBackButton={true}
      onBackButtonClick={handleBackButtonClick}
    >
      {children}
    </WithSideMenuLayout>
  );
};

export default KnowledgeDetailLayout;