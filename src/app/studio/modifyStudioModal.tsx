import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import useGroups from '@/hooks/useGroups';
import { useTranslation } from '@/utils/i18n';
import OperateModal from '@/components/operate-modal';
import CommonForm from '@/components/knowledge/commonForm';
import { ModifyStudioModalProps } from '@/types/studio';

const ModifyStudioModal: React.FC<ModifyStudioModalProps> = ({ visible, onCancel, onConfirm, initialValues }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { groups, loading } = useGroups();
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;

    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
      if (groups.length > 0) {
        form.setFieldsValue({ team: [groups[0].id] });
      }
    }
  }, [initialValues, form, groups, visible]);

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
      title={initialValues ? t('studio.edit') : t('studio.add')}
      okText={t('common.confirm')}
      cancelText={t('common.cancel')}
      onCancel={onCancel}
      onOk={handleConfirm}
      confirmLoading={confirmLoading}
    >
      <CommonForm form={form} loading={loading} groups={groups} formType="studio" visible={visible} />
    </OperateModal>
  );
};

export default ModifyStudioModal;