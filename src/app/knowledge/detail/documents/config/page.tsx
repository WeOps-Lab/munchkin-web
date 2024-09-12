'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from 'antd';
import PreprocessStep from '../modify/preprocessStep';
import useSaveConfig from '@/hooks/useSaveConfig';

const DocsConfigPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [config, setConfig] = useState(null);
  const [sourceType, setSourceType] = useState<string | null>(null);
  const [id, setId] = useState<string | null>(null);
  const { saveConfig } = useSaveConfig();

  useEffect(() => {
    const configParam = searchParams.get('config');
    const sourceTypeParam = searchParams.get('sourceType');
    const idParam = searchParams.get('id');
    if (configParam) {
      setConfig(JSON.parse(configParam));
    }
    if (sourceTypeParam) {
      setSourceType(sourceTypeParam);
    }
    if (idParam) {
      setId(idParam);
    }
  }, [searchParams]);

  const handleConfigChange = (newConfig: any) => {
    console.log('changed~~~~~', newConfig);
    setConfig(newConfig);
  };

  const handleSaveClick = async () => {
    if (config) {
      const success = await saveConfig(config);
      success && router.back();
    }
  };

  return (
    <div>
      {config && sourceType && id && (
        <>
          <PreprocessStep
            onConfigChange={handleConfigChange}
            knowledgeSourceType={sourceType}
            knowledgeDocumentIds={[Number(id)]}
            initialConfig={config}
          />
          <div className="text-right mt-4">
            <Button type="primary" onClick={handleSaveClick}>
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DocsConfigPage;