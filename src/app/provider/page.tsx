'use client';

import React, { useState, useEffect } from 'react';
import { Segmented, message } from 'antd';
import useApiClient from '@/utils/request';
import ProviderGrid from '@/components/provider/grid';
import { Model, TabConfig } from '@/types/provider';
import styles from './index.module.less';

const tabConfig: TabConfig[] = [
  { key: '1', label: 'LLM Model', type: 'llm_model' },
  { key: '2', label: 'Embed Model', type: 'embed_provider' },
  { key: '3', label: 'Rerank Model', type: 'rerank_provider' },
  { key: '4', label: 'OCR Model', type: 'ocr_provider' }
];

const ProviderPage: React.FC = () => {
  const { get } = useApiClient();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('1');

  const fetchModels = async (type: string) => {
    setLoading(true);
    try {
      const data = await get(`/model_provider_mgmt/${type}/`);
      const mappedData = Array.isArray(data) ? data.map(model => ({ ...model, id: Number(model.id) })) : [];
      setModels(mappedData);
    } catch (error) {
      message.error('Failed to fetch models');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels('llm_model');
  }, []);

  const handleSegmentedChange = (key: string) => {
    setActiveTab(key);
    const tab = tabConfig.find(t => t.key === key);
    if (tab) {
      fetchModels(tab.type);
    }
  };

  return (
    <div className={`px-12 w-full min-h-screen ${styles.providerContainer}`}>
      <Segmented
        options={tabConfig.map(tab => ({ label: tab.label, value: tab.key }))}
        value={activeTab}
        onChange={handleSegmentedChange}
        className="mb-4"
      />
      {tabConfig.map(tab => (
        <div key={tab.key} style={{ display: activeTab === tab.key ? 'block' : 'none' }}>
          <ProviderGrid models={models} filterType={tab.type} loading={loading} setModels={setModels} />
        </div>
      ))}
    </div>
  );
};

export default ProviderPage;