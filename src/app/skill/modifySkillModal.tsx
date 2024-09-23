'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Spin } from 'antd';
import useGroups from '@/hooks/useGroups';
import { useTranslation } from '@/utils/i18n';
import OperateModal from '@/components/operate-modal';
import { ModifySkillModalProps } from '@/types/skill';

const { Option } = Select;

const ModifySkillModal: React.FC<ModifySkillModalProps> = ({ visible, onCancel, onConfirm, initialValues }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { groups, loading } = useGroups();
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
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
      await onConfirm(values);
      form.resetFields();
      setConfirmLoading(false);
    } catch (info) {
      setConfirmLoading(false);
    }
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
              <Input placeholder={`Please ${t('common.input')} ${t('knowledge.form.name')}`} />
            </Form.Item>
            <Form.Item
              name="team"
              label={t('knowledge.form.group')}
              rules={[{ required: true, message: `${t('common.selectMsg')} ${t('knowledge.form.group')}!` }]}
            >
              <Select mode="multiple" placeholder={`Please ${t('common.select')} ${t('knowledge.form.group')}`}>
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
              <Input.TextArea rows={4} placeholder={`Please ${t('common.input')} ${t('knowledge.form.introduction')}`} />
            </Form.Item>
          </Form>
        </Spin>
      </OperateModal>
    </>
  );
};

export default ModifySkillModal;