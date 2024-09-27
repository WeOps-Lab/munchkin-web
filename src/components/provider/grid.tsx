import React, { useState } from 'react';
import { Input, Spin, Form, Input as AntdInput, Switch, message } from 'antd';
import Icon from '@/components/icon';
import { useTranslation } from '@/utils/i18n';
import OperateModal from '@/components/operate-modal';
import styles from './index.module.less';
import { Model, ModelConfig } from '@/types/provider';
import useApiClient from '@/utils/request';

interface ProviderGridProps {
  models: Model[];
  filterType: string;
  loading: boolean;
  setModels: React.Dispatch<React.SetStateAction<Model[]>>;
}

const ProviderGrid: React.FC<ProviderGridProps> = ({ models, filterType, loading, setModels }) => {
  const { t } = useTranslation();
  const { put } = useApiClient();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [form] = Form.useForm();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredModels = models.filter((model) =>
    model.name?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const getModelIcon = () => {
    const iconMap: Record<string, string> = {
      llm_model: 'chatgpticon',
      embed_provider: 'Embeddings',
      rerank_provider: 'jigoushuzhongxinpaixu',
      ocr_provider: 'ocr'
    };
    return iconMap[filterType] || 'chatgpticon';
  };

  const handleSettingsClick = (model: Model) => {
    const configField = getConfigField(filterType);
    setSelectedModel(model);
    const config = model[configField] as ModelConfig | undefined;
    form.setFieldsValue({
      apiKey: model.llm_config?.openai_api_key || '',
      url: filterType === 'llm_model' ? model.llm_config?.openai_base_url || '' : config?.base_url || '',
      enabled: model.enabled || false,
    });
    setIsModalVisible(true);
  };

  const getConfigField = (type: string): keyof Model => {
    const configMap: Record<string, keyof Model> = {
      llm_model: 'llm_config',
      embed_provider: 'embed_config',
      rerank_provider: 'rerank_config',
      ocr_provider: 'ocr_config'
    };
    return configMap[type];
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      const configField = getConfigField(filterType);
      if (!selectedModel) return;

      const updatedModel: Model = {
        ...selectedModel,
        enabled: values.enabled,
      };

      if (filterType === 'llm_model') {
        updatedModel.llm_config = {
          ...selectedModel.llm_config,
          openai_api_key: values.apiKey,
          openai_base_url: values.url,
        };
      } else {
        // 使用类型断言明确告诉 TypeScript configField 是 ModelConfig 类型的一部分
        (updatedModel[configField] as ModelConfig) = {
          ...(selectedModel[configField] as ModelConfig),
          base_url: values.url,
        };
      }

      setModalLoading(true);
      try {
        await put(`/model_provider_mgmt/${filterType}/${selectedModel.id}/`, updatedModel);
        message.success(t('common.updateSuccess'));
        setIsModalVisible(false);
        const updatedModels = models.map(model =>
          model.id === updatedModel.id ? updatedModel : model
        );
        setModels(updatedModels);
      } catch (error) {
        message.error(t('common.updateFailed'));
      } finally {
        setModalLoading(false);
      }
    }).catch(info => {
      console.log(t('common.valFailed'), info);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Input
          size="large"
          placeholder={`${t('common.search')}...`}
          style={{ width: '350px' }}
          onChange={handleSearch}
        />
      </div>
      <Spin spinning={loading}>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredModels.map((model) => (
            <div className="rounded-lg shadow px-4 py-6 relative" key={model.id}>
              <div className="flex justify-between items-start">
                <div style={{ flex: '0 0 auto' }}>
                  <Icon type={getModelIcon()} className="text-4xl" />
                </div>
                <div className="flex-1 ml-2">
                  <h3 className="text-base font-semibold break-words">{model.name}</h3>
                  <span className="inline-block mt-1 px-2 py-1 text-xs rounded-xl border">
                    {filterType}
                  </span>
                </div>
                <button onClick={() => handleSettingsClick(model)} className="absolute top-2 right-2">
                  <Icon type="shezhi" className="text-base" />
                </button>
              </div>
              <div className="absolute bottom-0 right-0 rounded-lg">
                <span className={`${styles.iconTriangle} ${model.enabled ? styles.enabled : styles.disabled}`}>
                  {model.enabled ? <Icon type="select-line" /> : <Icon type="guanbi" />}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Spin>
      <OperateModal
        title={t('provider.setting')}
        visible={isModalVisible}
        okText={t('common.confirm')}
        cancelText={t('common.cancel')}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={modalLoading}
      >
        <Form form={form} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          {filterType === 'llm_model' && (
            <Form.Item
              name="apiKey"
              label={t('provider.form.key')}
              rules={[{ required: true, message: `${t('common.input')} ${t('provider.form.key')}` }]}
            >
              <AntdInput.Password 
                visibilityToggle={false} 
                onCopy={(e) => e.preventDefault()} 
                onCut={(e) => e.preventDefault()} 
              />
            </Form.Item>
          )}
          <Form.Item
            name="url"
            label={t(`provider.form.${filterType === 'llm_model' ? 'url' : 'base_url'}`)}
            rules={[{ required: true, message: `${t('common.input')} ${t(`provider.form.${filterType === 'llm_model' ? 'url' : 'base_url'}`)}` }]}
          >
            <AntdInput />
          </Form.Item>
          <Form.Item
            name="enabled"
            label={t('provider.form.enabled')}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </OperateModal>
    </>
  );
};

export default ProviderGrid;