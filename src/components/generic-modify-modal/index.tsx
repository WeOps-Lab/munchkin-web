'use client';

import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import { useTranslation } from '@/utils/i18n';
import OperateModal from '@/components/operate-modal';
import CommonForm from '@/components/knowledge/commonForm';

interface GenericModifyModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (values: any) => void;
  initialValues: any;
  formType: string;
  initForm?: (form: any, groups: any) => void;
  groups: any[];
  loading: boolean;
}

const GenericModifyModal: React.FC<GenericModifyModalProps> = ({ visible, onCancel, onConfirm, initialValues, formType, initForm, groups = [], loading }) => { // 确保 groups 默认为 []
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;

    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
      if (initForm) {
        initForm(form, groups);
      }
    }
  }, [initialValues, form, groups, visible, initForm]);

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
    <OperateModal
      visible={visible}
      title={initialValues ? t(`${formType}.edit`) : t(`${formType}.add`)}
      okText={t('common.confirm')}
      cancelText={t('common.cancel')}
      onCancel={onCancel}
      onOk={handleConfirm}
      confirmLoading={confirmLoading}
    >
      <CommonForm form={form} loading={loading} groups={groups} formType={formType} visible={visible} />
    </OperateModal>
  );
};

export default GenericModifyModal;