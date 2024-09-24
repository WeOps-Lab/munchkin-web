'use client';

import React, { useState } from 'react';
import { Form, Input, Select, Switch, Button, InputNumber, List, Avatar, Checkbox, Slider } from 'antd';
import { useTranslation } from '@/utils/i18n';

const { Option } = Select;
const { TextArea } = Input;

const SkillSettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [chatHistoryEnabled, setChatHistoryEnabled] = useState(false);
  const [ragEnabled, setRagEnabled] = useState(false);
  const [ragSources, setRagSources] = useState<string[]>(['knowledgeA', 'knowledgeB']);
  const [messages, setMessages] = useState([
    { id: 1, content: 'Hello! How can I assist you today?', sender: 'bot' },
    { id: 2, content: 'hello', sender: 'user' }
  ]);

  const handleAddRagSource = () => {
    setRagSources([...ragSources, `knowledge${String.fromCharCode(65 + ragSources.length)}`]);
  };

  return (
    <div className="flex justify-between space-x-4">
      <div className="w-1/2 space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-3">Information</h2>
          <div className="border p-4 rounded-md">
            <Form 
              form={form}
              labelCol={{ flex: '0 0 128px' }}
              wrapperCol={{ flex: '1' }}>
              <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the name!' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Group" name="group" rules={[{ required: true, message: 'Please select a group!' }]}>
                <Select>
                  <Option value="group1">Group 1</Option>
                  <Option value="group2">Group 2</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Introduction" name="introduction" rules={[{ required: true, message: 'Please input the introduction!' }]}>
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item label="LLM Model" name="llmModel" rules={[{ required: true, message: 'Please select an LLM Model!' }]}>
                <Select>
                  <Option value="model1">Model 1</Option>
                  <Option value="model2">Model 2</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Prompt" name="prompt" rules={[{ required: true, message: 'Please input the prompt!' }]}>
                <TextArea rows={4} />
              </Form.Item>
            </Form>
          </div>
        </div>

        <div className="rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Chat Enhancement</h2>
          <div className="border p-4 rounded-md">
            <Form labelCol={{ flex: '0 0 128px' }} wrapperCol={{ flex: '1' }}>
              <Form.Item label="Chat History">
                <Switch size="small" className="ml-2" checked={chatHistoryEnabled} onChange={setChatHistoryEnabled} />
              </Form.Item>
              {chatHistoryEnabled && (
                <>
                  <Form.Item label="RAG Score">
                    <Slider min={0} max={1} step={0.1} defaultValue={0.7} />
                  </Form.Item>
                  <Form.Item label="Quantity">
                    <InputNumber min={1} max={100} className="w-full" />
                  </Form.Item>
                </>
              )}
            </Form>
          </div>
          <h2 className="text-lg font-semibold mb-3">RAG</h2>
          <div className="border p-4 rounded-md">
            <Form labelCol={{ flex: '0 0 128px' }} wrapperCol={{ flex: '1' }}>
              <Form.Item label="RAG">
                <Switch size="small" className="ml-2" checked={ragEnabled} onChange={setRagEnabled} />
              </Form.Item>
              {ragEnabled && (
                <div>
                  <Form.Item label="RAG Source">
                    <Checkbox.Group options={['Show', 'Do not show']} defaultValue={['Do not show']} />
                  </Form.Item>
                  <Form.Item label="Knowledge Base">
                    <Button type="dashed" onClick={handleAddRagSource}>
                      + Add
                    </Button>
                    {ragSources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between mt-2">
                        <Checkbox>{source}</Checkbox>
                        <div>
                          <Button type="link">Edit</Button>
                          <Button type="link" danger>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </Form.Item>
                </div>
              )}
            </Form>
          </div>
        </div>
      </div>

      <div className="w-1/2 space-y-4">
        <div className="bg-white p-6 shadow rounded-lg h-full">
          <h2 className="text-lg font-semibold mb-3">Test</h2>
          <div className="overflow-y-auto h-[400px]">
            <List
              itemLayout="horizontal"
              dataSource={messages}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.sender === 'bot' ? <Avatar src="/bot_avatar.png" /> : <Avatar>{item.sender.charAt(0).toUpperCase()}</Avatar>}
                    title={item.sender === 'bot' ? 'Bot' : 'User'}
                    description={item.content}
                  />
                </List.Item>
              )}
            />
          </div>
          <Input placeholder="Type a message..." className="mt-2" />
        </div>
      </div>
    </div>
  );
};

export default SkillSettingsPage;