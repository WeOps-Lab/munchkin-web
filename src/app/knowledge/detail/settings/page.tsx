'use client';
import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, message } from 'antd';
import ConfigComponent from '@/components/knowledge/config';
import useApiClient from '@/utils/request';

const { TextArea } = Input;

const SettingsPage: React.FC = () => {
  const { post } = useApiClient();
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    name: '',
    introduction: '',
    team: ''
  });
  const [configData, setConfigData] = useState({
    selectedSearchTypes: [] as string[],
    rerankModel: false,
    selectedRerankModel: null as string | null,
    textSearchWeight: 0.5,
    vectorSearchWeight: 0.5,
    quantity: 10,
    candidate: 10,
    selectedEmbedModel: null as string | null,
  });

  const handleConfirm = () => {
    form.validateFields()
      .then(async values => {
        const params = {
          name: values.name,
          introduction: values.introduction,
          team: values.team,
          embed_model: configData.selectedEmbedModel,
          enable_rerank: configData.rerankModel,
          rerank_model: configData.selectedRerankModel,
          enable_text_search: configData.selectedSearchTypes.includes('textSearch'),
          text_search_weight: configData.textSearchWeight,
          enable_vector_search: configData.selectedSearchTypes.includes('vectorSearch'),
          vector_search_weight: configData.vectorSearchWeight,
          rag_k: configData.quantity,
          rag_num_candidates: configData.candidate,
        };

        try {
          const response = await post(`/knowledge_mgmt/knowledge_base/{id}/update_settings/`, params);
          message.success('Settings updated successfully!');
          console.log(response.data);
        } catch (error) {
          message.error('Failed to update settings.');
          console.error(error);
        }
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
          configData={configData}
          setConfigData={setConfigData}
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