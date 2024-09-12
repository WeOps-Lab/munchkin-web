'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Spin } from 'antd';
import useApiClient from '@/utils/request';
import { useTranslation } from '@/utils/i18n';
import OperateModal from '@/components/operate-modal';
import { ModifyKnowledgeModalProps, groupProps } from '@/types/knowledge'

const { Option } = Select;

const ModifyKnowledgeModal: React.FC<ModifyKnowledgeModalProps> = ({ visible, onCancel, onConfirm, initialValues }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [groups, setGroups] = useState<groupProps[]>([]);
  const { get, isLoading } = useApiClient();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  useEffect(() => {
    if (isLoading) return;
    const fetchGroups = async () => {
      try {
        const data = await get('/knowledge_mgmt/knowledge_base/get_teams/');
        setGroups(data || []);
      } catch (error) {
        console.error(`${t('common.fetchFailed')}:`, error);
      }
    };
    fetchGroups();
  }, [get, isLoading]);

  const handleConfirm = async () => {
    try {
      const values = await form.validateFields();
      onConfirm(values);
      form.resetFields();
    } catch (info) {
      console.log(t('common.valFailed'), info);
    }
  };

  return (
    <OperateModal
      visible={visible}
      title={initialValues ? t('knowledge.edit') : t('knowledge.add')}
      okText={t('common.confirm')}
      cancelText={t('common.cancel')}
      onCancel={onCancel}
      onOk={handleConfirm}
    >
      <Spin spinning={isLoading}>
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
            name="introduction"
            label={t('knowledge.form.introduction')}
            rules={[{ required: true, message: `${t('common.inputMsg')} ${t('knowledge.form.introduction')}!` }]}
          >
            <Input.TextArea rows={4} placeholder={t('common.input')} />
          </Form.Item>
        </Form>
      </Spin>
    </OperateModal>
  );
};

export default ModifyKnowledgeModal;