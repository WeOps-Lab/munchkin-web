'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Spin, Modal, Button } from 'antd';
import useGroups from '@/hooks/useGroups';
import useApiClient from '@/utils/request';
import { useTranslation } from '@/utils/i18n';
import OperateModal from '@/components/operate-modal';
import { ModifyKnowledgeModalProps, ModelOption } from '@/types/knowledge';

const { Option } = Select;

const ModifyKnowledgeModal: React.FC<ModifyKnowledgeModalProps> = ({ visible, onCancel, onConfirm, initialValues }) => {
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
        console.error('Failed to fetch models:', error);
      }
    };

    fetchModels();
  }, [get]);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setOriginalEmbedModel(initialValues.embed_model);
    } else {
      form.resetFields();
      if (groups.length > 0) {
        form.setFieldsValue({ team: [groups[0].id] });
      }
    }
  }, [initialValues, form, groups]);

  const handleConfirm = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      if (initialValues && values.embed_model !== originalEmbedModel) {
        setModalContent('After switching the embedding model, it is necessary to retrain the knowledge base documents. Please check the training status in the knowledge base details.');
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
        <Spin spinning={loading}>
          <Form form={form} layout="vertical" name="knowledge_form">
            <Form.Item
              name="name"
              label={t('knowledge.form.name')}
              rules={[{ required: true, message: `${t('common.inputMsg')} ${t('knowledge.form.name')}!` }]}
            >
              <Input placeholder={t('common.input')} />
            </Form.Item>
            <Form.Item
              name="team"
              label={t('knowledge.form.group')}
              rules={[{ required: true, message: `${t('common.selectMsg')} ${t('knowledge.form.introduction')}!` }]}
            >
              <Select mode="multiple" placeholder={t('common.select')}>
                {groups.map(group => (
                  <Option key={group.id} value={group.id}>{group.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="embed_model"
              label={t('knowledge.form.embedModel')}
              rules={[{ required: true, message: `${t('common.selectMsg')} ${t('knowledge.form.embedModel')}!` }]}
            >
              <Select placeholder={t('common.select')}>
                {modelOptions.map((model) => (
                  <Option key={model.id} value={model.id} disabled={!model.enabled}>
                    {model.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="introduction"
              label={t('knowledge.form.introduction')}
              rules={[{ required: true, message: `${t('common.inputMsg')} ${t('knowledge.form.introduction')}!` }]}
            >
              <Input.TextArea rows={4} placeholder={t('common.input')} />
            </Form.Item>
          </Form>
        </Spin>
      </OperateModal>
      <Modal
        title="Confirm"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={modalLoading}
      >
        <p>{modalContent}</p>
      </Modal>
    </>
  );
};

export default ModifyKnowledgeModal;