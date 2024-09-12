import React, { useState, useEffect } from 'react';
import { Input, Form, InputNumber } from 'antd';

const { TextArea } = Input;

interface WebLinkFormProps {
  onFormChange: (isValid: boolean) => void;
  onFormDataChange: (data: { name: string, link: string, deep: number }) => void;
}

const WebLinkForm: React.FC<WebLinkFormProps> = ({ onFormChange, onFormDataChange }) => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<{ name: string; link: string; deep: number }>({
    name: '',
    link: '',
    deep: 1,
  });

  useEffect(() => {
    const isValid = formData.name.trim() !== '' && formData.link.trim() !== '';
    onFormChange(isValid);
    onFormDataChange(formData);
  }, [formData, onFormChange, onFormDataChange]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <div className="px-16">
      <Form
        form={form}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 20 }}
        onValuesChange={() => {
          const isValid = formData.name.trim() !== '' && formData.link.trim() !== '';
          onFormChange(isValid);
          onFormDataChange(formData);
        }}
      >
        <Form.Item label="Name">
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Link">
          <TextArea
            placeholder="Link"
            value={formData.link}
            onChange={(e) => handleInputChange('link', e.target.value)}
            rows={3}
          />
        </Form.Item>
        <Form.Item label="Deep">
          <InputNumber
            min={1}
            value={formData.deep}
            style={{ width: '100%' }}
            onChange={(value) => {
              if (value !== null) {
                handleInputChange('deep', value);
              }
            }}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default WebLinkForm;