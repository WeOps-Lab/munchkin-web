'use client';
import React, { useState } from 'react';
import { Form, Input, Button, Row, Col } from 'antd';
import ConfigComponent from '@/components/knowledge/config';

const { TextArea } = Input;

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    name: '',
    introduction: '',
    team: ''
  });
  const [selectedSearchType, setSelectedSearchType] = useState<string | null>(null);
  const [rerankModel, setRerankModel] = useState<boolean>(false);
  const [selectedRerankModel, setSelectedRerankModel] = useState<string | null>(null);
  const [weight, setWeight] = useState<number>(0.5);
  const [quantity, setQuantity] = useState<number>(10);
  const [candidate, setCandidate] = useState<number>(10);

  const handleConfirm = () => {
    form.validateFields()
      .then(values => {
        console.log('Form Values:', values);
        // 在这里处理确认逻辑
      })
      .catch(errorInfo => {
        console.log('Validation Failed:', errorInfo);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    setFormData({
      name: '',
      introduction: '',
      team: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', position: 'relative' }}>
      <Form
        form={form}
        layout="horizontal"
        name="my_form"
        initialValues={formData}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input name="name" value={formData.name} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item
          label="Team"
          name="team"
          rules={[{ required: true, message: 'Please input your team!' }]}
        >
          <Input name="team" value={formData.team} onChange={handleInputChange} />
        </Form.Item>

        <Form.Item
          label="Introduction"
          name="introduction"
          rules={[{ required: true, message: 'Please input your introduction!' }]}
        >
          <TextArea name="introduction" value={formData.introduction} onChange={handleInputChange} rows={4} />
        </Form.Item>

        <ConfigComponent
          selectedSearchType={selectedSearchType}
          setSelectedSearchType={setSelectedSearchType}
          rerankModel={rerankModel}
          setRerankModel={setRerankModel}
          selectedRerankModel={selectedRerankModel}
          setSelectedRerankModel={setSelectedRerankModel}
          weight={weight}
          setWeight={setWeight}
          quantity={quantity}
          setQuantity={setQuantity}
          candidate={candidate}
          setCandidate={setCandidate}
        />

        <Form.Item wrapperCol={{ span: 24 }}>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '20px' }}>
            <Row justify="end" gutter={16}>
              <Col>
                <Button onClick={handleCancel}>
                  Cancel
                </Button>
              </Col>
              <Col>
                <Button type="primary" onClick={handleConfirm}>
                  Confirm
                </Button>
              </Col>
            </Row>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SettingsPage;
