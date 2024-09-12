import React, { useState, useEffect } from 'react';
import { Input, Form } from 'antd';
import dynamic from 'next/dynamic';
import 'aieditor/dist/style.css';

// 动态加载 AIEditor 组件，并禁用服务器端渲染
const AIEditor = dynamic(() => import('@/components/ai-editor'), { ssr: false });

interface CustomTextFormProps {
  onFormChange: (isValid: boolean) => void;
  onFormDataChange: (data: { name: string; content: string }) => void;
}

const CustomTextForm: React.FC<CustomTextFormProps> = ({ onFormChange, onFormDataChange }) => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<{ name: string; content: string }>({
    name: '',
    content: '',
  });

  useEffect(() => {
    const isValid = formData.name.trim() !== '' && formData.content.trim() !== '';
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
          const isValid = formData.name.trim() !== '' && formData.content.trim() !== '';
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
        <Form.Item label="Content">
          <div style={{ height: '500px' }}>
            <AIEditor
              value={formData.content}
              onChange={(value) => handleInputChange('content', value)}
              placeholder="Content"
              style={{ height: '100%' }}
            />
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CustomTextForm;