'use client';

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Spin } from 'antd';
import useApiClient from '@/utils/request';
import { KnowledgeValues } from '@/types/knowledge';
import OperateModal from '@/components/operate-modal';

const { Option } = Select;

interface ModifyKnowledgeModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (values: KnowledgeValues) => void;
  initialValues?: KnowledgeValues; // 使用更具体的类型
}

const ModifyKnowledgeModal: React.FC<ModifyKnowledgeModalProps> = ({ visible, onCancel, onConfirm, initialValues }) => {
  const [form] = Form.useForm();
  const [groups, setGroups] = useState<string[]>([]);
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
    const fetchData = async () => {
      try {
        const response = await get('/new_app/test/');
        console.log('Fetched data:', response);
        setGroups(response.data);
      } catch (error) {
        console.error('Failed to fetch groups:', error);
      }
    };
    fetchData();
  }, [get, isLoading]);

  const handleConfirm = () => {
    form.validateFields()
      .then(values => {
        onConfirm(values);
        form.resetFields();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <OperateModal
      visible={visible}
      title={initialValues ? "Edit Knowledge" : "Add New Knowledge"}
      okText="Confirm"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleConfirm}
    >
      <Spin spinning={isLoading}>
        <Form form={form} layout="vertical" name="knowledge_form">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="group"
            label="Group"
            rules={[{ required: true, message: 'Please select the group!' }]}
          >
            <Select placeholder="Select a group">
              {groups.map(group => (
                <Option key={group} value={group}>{group}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="introduction"
            label="Introduction"
            rules={[{ required: true, message: 'Please input the introduction!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Spin>
    </OperateModal>
  );
};

export default ModifyKnowledgeModal;
