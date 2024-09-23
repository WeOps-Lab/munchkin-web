import React, { useEffect, useState } from 'react';
import { Select, Checkbox, Switch, Slider, InputNumber, Input, message } from 'antd';
import { ModelOption, TestConfigData } from '@/types/knowledge';
import useApiClient from '@/utils/request';
import { useTranslation } from '@/utils/i18n';
import styles from './index.module.less';

const { Option } = Select;

interface ConfigProps {
  configData: TestConfigData;
  setConfigData: React.Dispatch<React.SetStateAction<TestConfigData>>;
}

const ConfigComponent: React.FC<ConfigProps> = ({ configData, setConfigData }) => {
  const { t } = useTranslation();
  const { get } = useApiClient();
  const [loadingModels, setLoadingModels] = useState<boolean>(true);
  const [modelOptions, setModelOptions] = useState<ModelOption[]>([]);
  const [rerankModelOptions, setRerankModelOptions] = useState<ModelOption[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const [rerankData, embedData] = await Promise.all([
          get('/model_provider_mgmt/rerank_provider/'),
          get('/model_provider_mgmt/embed_provider/')
        ]);
        setModelOptions(embedData);
        setRerankModelOptions(rerankData);
      } catch (error) {
        message.error(t('common.fetchFailed'));
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, [get]);

  const handleSearchTypeChange = (type: string) => {
    setConfigData(prevData => ({
      ...prevData,
      selectedSearchTypes: prevData.selectedSearchTypes.includes(type)
        ? prevData.selectedSearchTypes.filter(t => t !== type)
        : [...prevData.selectedSearchTypes, type]
    }));
  };

  return (
    <>
      <div className="mb-4 flex items-center">
        <label className="block text-sm font-medium mb-1 w-32">{t('knowledge.embeddingModel')}</label>
        <Select
          className="flex-1"
          placeholder={`Please ${t('common.input')} ${t('knowledge.embeddingModel')}`}
          disabled
          loading={loadingModels}
          value={configData.selectedEmbedModel}
          onChange={(value) => setConfigData(prevData => ({ ...prevData, selectedEmbedModel: value }))}
        >
          {modelOptions.map((model) => (
            <Option key={model.id} value={model.id} disabled={!model.enabled}>
              {model.name}
            </Option>
          ))}
        </Select>
      </div>
      <div className={`mb-4 flex ${styles.configTxt}`}>
        <label className="block text-sm font-medium mb-1 w-32">{t('knowledge.retrievalSetting')}</label>
        <div className="flex-1">
          <div className="p-4 border rounded-md mb-4">
            <div className="flex items-center mb-2 justify-between">
              <h3 className="text-base font-semibold">{t('knowledge.textSearch')}</h3>
              <Checkbox
                checked={configData.selectedSearchTypes.includes('textSearch')}
                onChange={() => handleSearchTypeChange('textSearch')}
              />
            </div>
            <p className="text-sm mb-4">
              {t('knowledge.textSearchDesc')}
            </p>
            {configData.selectedSearchTypes.includes('textSearch') && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm w-32">{t('knowledge.weight')}</label>
                  <Slider
                    className="flex-1 mx-2"
                    min={0}
                    max={1}
                    step={0.01}
                    value={configData.textSearchWeight}
                    onChange={(value) => setConfigData(prevData => ({ ...prevData, textSearchWeight: value }))}
                  />
                  <Input className="w-14" value={configData.textSearchWeight.toFixed(2)} readOnly />
                </div>
              </>
            )}
          </div>
          <div className="p-4 border rounded-md mb-4">
            <div className="flex items-center mb-2 justify-between">
              <h3 className="text-base font-semibold">{t('knowledge.vectorSearch')}</h3>
              <Checkbox
                checked={configData.selectedSearchTypes.includes('vectorSearch')}
                onChange={() => handleSearchTypeChange('vectorSearch')}
              />
            </div>
            <p className="text-sm mb-4">
              {t('knowledge.vectorSearchDesc')}
            </p>
            {configData.selectedSearchTypes.includes('vectorSearch') && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm w-32">{t('knowledge.weight')}</label>
                  <Slider
                    className="flex-1 mx-2"
                    min={0}
                    max={1}
                    step={0.01}
                    value={configData.vectorSearchWeight}
                    onChange={(value) => setConfigData(prevData => ({ ...prevData, vectorSearchWeight: value }))}
                  />
                  <Input className="w-14" value={configData.vectorSearchWeight.toFixed(2)} readOnly />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm w-32">{t('knowledge.returnQuantity')}</label>
                  <InputNumber
                    min={1}
                    value={configData.quantity}
                    onChange={(value) => setConfigData(prevData => ({ ...prevData, quantity: value ?? 1 }))}
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm w-32">{t('knowledge.candidateQuantity')}</label>
                  <InputNumber
                    min={1}
                    value={configData.candidate}
                    onChange={(value) => setConfigData(prevData => ({ ...prevData, candidate: value ?? 1 }))}
                    style={{ width: '100%' }}
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm w-32">{t('knowledge.rerankModel')}</label>
            <Switch
              size="small"
              checked={configData.rerankModel}
              onChange={(checked) => setConfigData(prevData => ({ ...prevData, rerankModel: checked, selectedRerankModel: checked ? prevData.selectedRerankModel : null }))}
            />
          </div>
          {configData.rerankModel && (
            <div className="flex items-center justify-between mb-4">
              <Select
                className="flex-1"
                placeholder={`Please ${t('common.select')} ${t('knowledge.rerankModel')}`}
                loading={loadingModels}
                value={configData.selectedRerankModel}
                onChange={(value) => setConfigData(prevData => ({ ...prevData, selectedRerankModel: value }))}
              >
                {rerankModelOptions.map((model) => (
                  <Option key={model.id} value={model.id} disabled={!model.enabled}>
                    {model.name}
                  </Option>
                ))}
              </Select>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ConfigComponent;