import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import useGroups from '@/hooks/useGroups';
import useApiClient from '@/utils/request';
import { useTranslation } from '@/utils/i18n';
import OperateModal from '@/components/operate-modal';
import CommonForm from '@/components/knowledge/commonForm';
import { ModifyKnowledgeModalProps, ModelOption } from '@/types/knowledge';

const ModifyKnowledgeModal: React.FC<ModifyKnowledgeModalProps> = ({ visible, onCancel, onConfirm, initialValues, isTraining }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { groups, loading } = useGroups();
  const { get } = useApiClient();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modelOptions, setModelOptions] = useState<ModelOption[]>([]);
  const [originalEmbedModel, setOriginalEmbedModel] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await get('/model_provider_mgmt/embed_provider/');
        setModelOptions(data);
      } catch (error) {
        console.error(`${t('common.fetchFailed')}:`, error);
      }
    };

    fetchModels();
  }, [get]);

  useEffect(() => {
    if (!visible) return;

    if (initialValues) {
      form.setFieldsValue(initialValues);
      setOriginalEmbedModel(initialValues.embed_model);
    } else {
      form.resetFields();
      const defaultValues: any = {};
      if (groups.length > 0) {
        defaultValues.team = [groups[0].id];
      }
      if (modelOptions.length > 0) {
        defaultValues.embed_model = modelOptions.filter(option => option.enabled)?.[0]?.id;
      }
      form.setFieldsValue(defaultValues);
    }
  }, [initialValues, form, groups, modelOptions, visible]);

  const handleConfirm = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      if (initialValues && values.embed_model !== originalEmbedModel) {
        setModalContent(t('knowledge.embeddingModelTip'));
        setIsModalVisible(true);
      } else {
        await onConfirm(values);
        form.resetFields();
        setConfirmLoading(false);
      }
    } catch (info) {
      setConfirmLoading(false);
    }
  };

  const handleModalOk = async () => {
    try {
      setModalLoading(true);
      const values = await form.validateFields();
      await onConfirm(values);
      form.resetFields();
    } finally {
      setModalLoading(false);
      setConfirmLoading(false);
      setIsModalVisible(false);
    }
  };

  const handleModalCancel = () => {
    setConfirmLoading(false);
    setIsModalVisible(false);
  };

  return (
    <>
      <OperateModal
        visible={visible}
        title={initialValues ? t('knowledge.edit') : t('knowledge.add')}
        okText={t('common.confirm')}
        cancelText={t('common.cancel')}
        onCancel={onCancel}
        onOk={handleConfirm}
        confirmLoading={confirmLoading}
      >
        <CommonForm
          form={form}
          loading={loading}
          groups={groups}
          modelOptions={modelOptions}
          isTraining={isTraining}
          formType="knowledge"
          visible={visible}
        />
      </OperateModal>
      <OperateModal
        title={t('common.confirm')}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={modalLoading}
        centered
      >
        <p>{modalContent}</p>
      </OperateModal>
    </>
  );
};

export default ModifyKnowledgeModal;
