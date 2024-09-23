'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Breadcrumb } from 'antd';
import PreprocessStep from '../modify/preprocessStep';
import useSaveConfig from '@/hooks/useSaveConfig';
import { useTranslation } from '@/utils/i18n';

const DocsConfigPage: React.FC = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [config, setConfig] = useState(null);
  const [sourceType, setSourceType] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const { saveConfig } = useSaveConfig();

  const sourceTypeToDisplayText: { [key: string]: string } = {
    file: t('knowledge.localFile'),
    web_page: t('knowledge.webLink'),
    manual: t('knowledge.cusText'),
  };

  useEffect(() => {
    const configParam = searchParams.get('config');
    const sourceTypeParam = searchParams.get('sourceType');
    const idParam = searchParams.get('documentId');
    const statusParam = searchParams.get('status');
    if (configParam) {
      setConfig(JSON.parse(configParam));
    }
    if (sourceTypeParam) {
      setSourceType(sourceTypeParam);
    }
    if (idParam) {
      setDocumentId(idParam);
    }
    if (statusParam) {
      setStatus(statusParam);
    }
  }, [searchParams]);

  const handleConfigChange = (newConfig: any) => {
    setConfig(newConfig);
  };

  const handleSaveClick = async (isSaveOnly = true) => {
    if (config) {
      const success = await saveConfig({
        ...(config as object),
        is_save_only: isSaveOnly,
      });
      success && router.back();
    }
  };

  return (
    <div>
      <Breadcrumb className="mb-5">
        <Breadcrumb.Item>{t('knowledge.menu')}</Breadcrumb.Item>
        <Breadcrumb.Item>{sourceType && sourceTypeToDisplayText[sourceType]}</Breadcrumb.Item>
        <Breadcrumb.Item>{t('knowledge.config')}</Breadcrumb.Item>
      </Breadcrumb>
      {config && sourceType && documentId && (
        <>
          <PreprocessStep
            onConfigChange={handleConfigChange}
            knowledgeSourceType={sourceType}
            knowledgeDocumentIds={[Number(documentId)]}
            initialConfig={config}
          />
          <div className="fixed bottom-10 right-20 z-50 flex space-x-2">
            <Button type="primary" onClick={() => handleSaveClick(false)}>
              {t('common.confirm')}
            </Button>
            {status !== 'Training' && <Button type="primary" onClick={() => handleSaveClick(true)}>
              {`${t('common.save')} & ${t('common.train')}`}
            </Button>}
          </div>
        </>
      )}
    </div>
  );
};

export default DocsConfigPage;