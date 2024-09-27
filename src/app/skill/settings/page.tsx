'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Switch, Button, InputNumber, Slider, Spin, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from '@/utils/i18n';
import { ProChat, ChatMessage } from '@ant-design/pro-chat';
import useGroups from '@/hooks/useGroups';
import useApiClient from '@/utils/request';
import Icon from '@/components/icon';
import styles from './index.module.less';
import { useSearchParams } from 'next/navigation';
import OperateModal from '@/components/operate-modal';
import { RagScoreThresholdItem, KnowledgeBase, ProChatMessage } from '@/types/skill' 

const { Option } = Select;
const { TextArea } = Input;

const iconTypes = ['zhishiku', 'zhishiku-red', 'zhishiku-blue', 'zhishiku-yellow', 'zhishiku-green'];

const getIconTypeByIndex = (index: number) => iconTypes[index % iconTypes.length];

const SkillSettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const { groups, loading: groupsLoading } = useGroups();
  const { t } = useTranslation();
  const { get, post, put } = useApiClient();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [chatHistoryEnabled, setChatHistoryEnabled] = useState(true);
  const [ragEnabled, setRagEnabled] = useState(true);
  const [showRagSource, setRagSourceStatus] = useState(false);
  const [ragSources, setRagSources] = useState<{ name: string, score: number }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<number[]>([]);
  const [llmModels, setLlmModels] = useState<{ id: number, name: string }[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [messages, setMessages] = useState<ProChatMessage[]>([]);
  const [quantity, setQuantity] = useState<number>(10);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [llmModelsData, knowledgeBasesData] = await Promise.all([
          get('/model_provider_mgmt/llm_model/'),
          get('/knowledge_mgmt/knowledge_base/')
        ]);
        setLlmModels(llmModelsData);
        setKnowledgeBases(knowledgeBasesData);
      } catch (error) {
        console.error(t('common.fetchFailed'), error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchInitialData();
  }, [get]);

  useEffect(() => {
    if (!groupsLoading) {
      setPageLoading(false);
    }
  }, [groupsLoading]);

  useEffect(() => {
    const fetchFormData = async () => {
      if (id && knowledgeBases.length) {
        try {
          const data = await get(`/model_provider_mgmt/llm/${id}/`);
          form.setFieldsValue({
            name: data.name,
            group: data.team,
            introduction: data.introduction,
            llmModel: data.llm_model,
            temperature: data.temperature || 0.7,
            prompt: data.skill_prompt,
          });
          setChatHistoryEnabled(data.enable_conversation_history);
          setRagEnabled(data.enable_rag);
          setRagSourceStatus(data.enable_rag_knowledge_source);

          const initialRagSources = data.rag_score_threshold.map((item: RagScoreThresholdItem) => ({
            name: knowledgeBases.find((base) => base.id === Number(item.knowledge_base))?.name,
            score: item.score
          })).filter(Boolean) as { name: string, score: number }[];
          setRagSources(initialRagSources);
          setQuantity(data.conversation_window_size !== undefined ? data.conversation_window_size : 10);

          const initialSelectedKnowledgeBases = data.rag_score_threshold.map((item: RagScoreThresholdItem) => Number(item.knowledge_base));
          setSelectedKnowledgeBases(initialSelectedKnowledgeBases);
        } catch (error) {
          console.error(t('common.fetchFailed'), error);
        }
      }
    };

    fetchFormData();
  }, [get, knowledgeBases]);

  const handleAddRagSource = () => {
    setModalVisible(true);
  };

  const handleModalOk = () => {
    setRagSources(selectedKnowledgeBases.map(id => {
      const base = knowledgeBases.find(base => base.id === id);
      return base ? { name: base.name, score: 0.7 } : null;
    }).filter(Boolean) as { name: string, score: number }[]);
    setModalVisible(false);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleKnowledgeBaseSelect = (id: number) => {
    setSelectedKnowledgeBases((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteRagSource = (sourceName: string) => {
    setRagSources(ragSources.filter((item) => item.name !== sourceName));
    const source = knowledgeBases.find(base => base.name === sourceName);
    if (source) {
      setSelectedKnowledgeBases(selectedKnowledgeBases.filter(id => id !== source.id));
    }
  };

  const handleScoreChange = (sourceName: string, newScore: number) => {
    setRagSources(ragSources.map((source) =>
      source.name === sourceName ? { ...source, score: newScore } : source
    ));
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const ragScoreThreshold = ragSources.map((source) => ({
        knowledge_base: knowledgeBases.find(base => base.name === source.name)?.id,
        score: source.score
      }));
      const payload = {
        name: values.name,
        team: values.group,
        introduction: values.introduction,
        llm_model: values.llmModel,
        skill_prompt: values.prompt,
        enable_conversation_history: chatHistoryEnabled,
        enable_rag: ragEnabled,
        enable_rag_knowledge_source: showRagSource,
        rag_score_threshold: ragScoreThreshold,
        conversation_window_size: chatHistoryEnabled ? quantity : undefined,
        temperature: values.temperature
      };
      setSaveLoading(true);
      await put(`/model_provider_mgmt/llm/${id}/`, payload);
      message.success(t('common.saveSuccess'));
    } catch (error) {
      console.error(t('common.saveFailed'), error);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSendMessage = async (newMessage: ProChatMessage[]) => {
    const message = newMessage[newMessage.length - 1];
    setMessages(prevMessages => [...prevMessages, { ...message, sender: 'user' }]);
    try {
      const values = await form.validateFields();
      const ragScoreThreshold = ragSources.map((source) => ({
        knowledge_base: knowledgeBases.find(base => base.name === source.name)?.id,
        score: source.score
      }));
      const payload = {
        user_message: message.content,
        llm_model: values.llmModel,
        skill_prompt: values.prompt,
        enable_rag: ragEnabled,
        enable_rag_knowledge_source: showRagSource,
        rag_score_threshold: ragScoreThreshold,
        chat_history: quantity ? newMessage.slice(0, quantity).map(msg => ({ text: msg.content, event: msg.role })) : [],
        conversation_window_size: chatHistoryEnabled ? quantity : undefined,
        temperature: values.temperature
      };

      const reply = await post('/model_provider_mgmt/llm/execute/', payload);
      const botMessage: ProChatMessage = {
        id: new Date().getTime(),
        content: reply,
        sender: 'bot'
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
      return reply;
    } catch (error) {
      console.error(t('common.fetchFailed'), error);
    }
  };

  return (
    <div className="relative">
      {(pageLoading || groupsLoading) && (
        <div className="absolute inset-0 bg-white bg-opacity-50 z-50 flex items-center justify-center">
          <Spin spinning={pageLoading || groupsLoading} />
        </div>
      )}
      <div className="flex justify-between space-x-4">
        <div className="w-1/2 space-y-4">
          <div className={`border rounded-md ${styles.llmContainer}`}>
            <h2 className="text-lg font-semibold mb-3">{t('skill.information')}</h2>
            <div className="px-4">
              <Form 
                form={form}
                labelCol={{ flex: '0 0 128px' }}
                wrapperCol={{ flex: '1' }}
                initialValues={{ temperature: 0.7 }}
              >
                <Form.Item label={t('skill.form.name')} name="name" rules={[{ required: true, message: `${t('common.input')} ${t('skill.form.name')}` }]}>
                  <Input />
                </Form.Item>
                <Form.Item label={t('skill.form.group')} name="group" rules={[{ required: true, message: `${t('common.input')} ${t('skill.form.group')}` }]}>
                  <Select mode="multiple">
                    {groups.map(group => (
                      <Option key={group.id} value={group.id}>{group.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label={t('skill.form.introduction')} name="introduction" rules={[{ required: true, message: `${t('common.input')} ${t('skill.form.introduction')}` }]}>
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item label={t('skill.form.llmModel')} name="llmModel" rules={[{ required: true, message: `${t('common.input')} ${t('skill.form.llmModel')}` }]}>
                  <Select>
                    {llmModels.map((model) => (
                      <Option key={model.id} value={model.id}>{model.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label={t('skill.form.temperature')} name="temperature">
                  <div className="flex">
                    <Slider
                      className="flex-1"
                      min={0} 
                      max={1} 
                      step={0.01} 
                      onChange={(value) => form.setFieldsValue({ temperature: value })}
                      value={form.getFieldValue('temperature')}
                    />
                    <InputNumber
                      min={0}
                      max={1}
                      step={0.01}
                      value={form.getFieldValue('temperature')}
                      onChange={(value) => form.setFieldsValue({ temperature: value })}
                    />
                  </div>
                </Form.Item>
                <Form.Item label={t('skill.form.prompt')} name="prompt" rules={[{ required: true, message: `${t('common.input')} ${t('skill.form.prompt')}` }]}>
                  <TextArea rows={4} />
                </Form.Item>
              </Form>
            </div>
          </div>
          <div className={`border rounded-md ${styles.llmContainer}`}>
            <h2 className="text-lg font-semibold mb-3">{t('skill.chatEnhancement')}</h2>
            <div className={`p-4 rounded-md pb-0 ${styles.contentWrapper}`}>
              <Form labelCol={{ flex: '0 0 128px' }} wrapperCol={{ flex: '1' }}>
                <div className="flex justify-between">
                  <h3 className="text-base mb-4">{t('skill.chatHistory')}</h3>
                  <Switch size="small" className="ml-2" checked={chatHistoryEnabled} onChange={setChatHistoryEnabled} />
                </div>
                {chatHistoryEnabled && (
                  <div className="pb-4">
                    <Form.Item label={t('skill.quantity')}>
                      <InputNumber min={1} max={100} className="w-full" value={quantity} onChange={(value) => setQuantity(value ?? 1)} />
                    </Form.Item>
                  </div>
                )}
              </Form>
            </div>
            <div className={`p-4 rounded-md pb-0 ${styles.contentWrapper}`}>
              <Form labelCol={{ flex: '0 0 128px' }} wrapperCol={{ flex: '1' }}>
                <div className="flex justify-between">
                  <h3 className="text-base mb-4">{t('skill.rag')}</h3>
                  <Switch size="small" className="ml-2" checked={ragEnabled} onChange={setRagEnabled} />
                </div>
                {ragEnabled && (
                  <div className="pb-4">
                    <Form.Item label={t('skill.ragSource')}>
                      <Switch size="small" className="ml-2" checked={showRagSource} onChange={setRagSourceStatus} />
                    </Form.Item>
                    <Form.Item label={t('skill.knowledgeBase')}>
                      <Button type="dashed" onClick={handleAddRagSource}>
                        + {t('common.add')}
                      </Button>
                      {ragSources.map((source, index) => (
                        <div key={index} className="w-full mt-2">
                          <div className={`w-full rounded-md px-4 py-2 flex items-center justify-between ${styles.borderContainer}`}>
                            <span>{source.name}</span>
                            <div className="flex-1 flex">
                              <Slider
                                className="flex-1 mx-2"
                                min={0}
                                max={1}
                                step={0.01}
                                value={source.score}
                                onChange={(value) => handleScoreChange(source.name, value)}
                              />
                              <Input className="w-14" value={source.score} readOnly />
                            </div>
                            <div>
                              <EditOutlined className="mr-[8px] ml-[8px]" />
                              <DeleteOutlined onClick={() => handleDeleteRagSource(source.name)} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </Form.Item>
                  </div>
                )}
              </Form>
            </div>
            <div className="px-4 py-2">
              <Button type="primary" onClick={handleSave} loading={saveLoading}>
                {t('common.save')}
              </Button>
            </div>
          </div>
        </div>
        <div className="w-1/2 space-y-4">
          <div className="rounded-lg h-full">
            <h2 className="text-lg font-semibold mb-3">Test</h2>
            <div style={{ height: 'calc(100vh - 270px)' }} className={`rounded-lg ${styles.chatContainer}`}>
              <ProChat
                request={async (messages: ChatMessage<Record<string, any>>[]) => {
                  const transformedMessages: ProChatMessage[] = messages.map(msg => ({
                    id: Number(msg.id),
                    content: String(msg.content),
                    role: msg.role === 'user' ? 'user' : 'bot',
                  }));
                  try {
                    const replyContent = await handleSendMessage(transformedMessages);
                    return {
                      content: new Response(replyContent)
                    };
                  } catch (error) {
                    console.error('Failed to send message', error);
                    return {
                      content: new Response('Error: Failed to send message')
                    };
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <OperateModal
        title={t('skill.selectKnowledgeBase')}
        visible={modalVisible}
        okText={t('common.confirm')}
        cancelText={t('common.cancel')}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Spin spinning={false}>
          <div className="grid grid-cols-3 gap-4 py-4">
            {knowledgeBases.map((base, index) => (
              <div
                key={base.id}
                className={`flex p-4 border rounded-md cursor-pointer ${selectedKnowledgeBases.includes(base.id) ? styles.selectedKnowledge : ''}`}
                onClick={() => handleKnowledgeBaseSelect(base.id)}
              >
                <Icon type={getIconTypeByIndex(index)} className="text-2xl mr-[8px]" />
                {base.name}
              </div>
            ))}
          </div>
          <div className="pt-4">
            {t('skill.selectedCount')}: {selectedKnowledgeBases.length}
          </div>
        </Spin>
      </OperateModal>
    </div>
  );
};

export default SkillSettingsPage;