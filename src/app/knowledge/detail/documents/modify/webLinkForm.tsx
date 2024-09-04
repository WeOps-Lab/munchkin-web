import React, { useState, useEffect } from 'react';
import { Input, Form, InputNumber } from 'antd';

const { TextArea } = Input;

interface WebLinkFormProps {
  onFormChange: (isValid: boolean) => void;
}

const WebLinkForm: React.FC<WebLinkFormProps> = ({ onFormChange }) => {
  const [form] = Form.useForm();
  const [name, setName] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [deep, setDeep] = useState<number>(1);

  useEffect(() => {
    onFormChange(name.trim() !== '' && link.trim() !== '');
  }, [name, link, onFormChange]);

  return (
    <div className="px-16">
      <Form 
        form={form} 
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 20 }}
        onValuesChange={() => onFormChange(name.trim() !== '' && link.trim() !== '')}
      >
        <Form.Item label="Name">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Link">
          <TextArea
            placeholder="Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            rows={3}
          />
        </Form.Item>
        <Form.Item label="Deep">
          <InputNumber
            min={1}
            value={deep}
            style={{ width: '100%' }}
            onChange={(value) => {
              if (value !== null) {
                setDeep(value);
              }
            }}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default WebLinkForm;