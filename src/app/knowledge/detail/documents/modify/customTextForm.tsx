import React, { useState, useEffect } from 'react';
import { Input, Form } from 'antd';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

interface CustomTextFormProps {
  onFormChange: (isValid: boolean) => void;
}

// 懒加载 ReactQuill 组件，并禁用服务器端渲染
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const CustomTextForm: React.FC<CustomTextFormProps> = ({ onFormChange }) => {
  const [form] = Form.useForm();
  const [name, setName] = useState<string>('');
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    onFormChange(name.trim() !== '' && content.trim() !== '');
  }, [name, content, onFormChange]);

  const modules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  return (
    <div className="px-16">
      <Form 
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 20 }}
        form={form}
        onValuesChange={() => onFormChange(name.trim() !== '' && content.trim() !== '')}>
        <Form.Item label="Name">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Content">
          <div style={{ height: '200px' }}>
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Content"
            />
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CustomTextForm;