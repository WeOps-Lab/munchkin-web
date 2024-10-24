'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Switch, Dropdown, Menu, Tag, Checkbox, message, Spin } from 'antd';
import { useTranslation } from '@/utils/i18n';
import { DeleteOutlined, DownOutlined, CheckOutlined } from '@ant-design/icons';
import useGroups from '@/hooks/useGroups';
import useApiClient from '@/utils/request';
import { useSearchParams } from 'next/navigation';
import { Skill } from '@/types/skill';
import OperateModal from '@/components/studio/operateModal';
import styles from '@/styles/common.less';
import Icon from '@/components/icon';

const { Option } = Select;
const { TextArea } = Input;

const StudioSettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { get, patch } = useApiClient();
  const { groups } = useGroups();
  const [pageLoading, setPageLoading] = useState(true);
  const [rasaModels, setRasaModels] = useState<{ id: number; name: string; enabled: boolean }[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [channels, setChannels] = useState<{ id: number; name: string }[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<number[]>([]);
  const [isSkillModalVisible, setIsSkillModalVisible] = useState(false);
  const [isDomainEnabled, setIsDomainEnabled] = useState(false);
  const [isPortMappingEnabled, setIsPortMappingEnabled] = useState(false);
  const [botDomain, setBotDomain] = useState('');
  const [nodePort, setNodePort] = useState(5005);
  const [enableSsl, setEnableSsl] = useState(false);
  const [online, setOnline] = useState(false);
  const searchParams = useSearchParams();
  const botId = searchParams.get('id');

  useEffect(() => {
    if (!botId) return;

    const fetchInitialData = async () => {
      try {
        const [rasaModelsData, skillsData, channelsData, botData] = await Promise.all([
          get('/bot_mgmt/rasa_model/'),
          get('/model_provider_mgmt/llm/'),
          get('/bot_mgmt/bot/get_bot_channels/', { bot_id: botId }),
          get(`/bot_mgmt/bot/${botId}`)
        ]);

        setRasaModels(rasaModelsData);
        setSkills(skillsData);
        setChannels(channelsData);

        let initialRasaModel = botData.rasa_model;
        if (!initialRasaModel && rasaModelsData.length > 0) {
          initialRasaModel = rasaModelsData[0].id;
        }
  
        form.setFieldsValue({
          name: botData.name,
          introduction: botData.introduction,
          group: botData.team,
          rasa_model: initialRasaModel
        });

        setOnline(botData.online);
        setSelectedSkills(botData.llm_skills);
        setSelectedChannels(botData.channels);
        setIsDomainEnabled(botData.enable_bot_domain);
        setEnableSsl(botData.enable_ssl); // 设置初始SSL状态
        setIsPortMappingEnabled(botData.enable_node_port);
        setBotDomain(botData.bot_domain);
        setNodePort(botData.node_port);
      } catch (error) {
        message.error(t('common.fetchFailed'));
      } finally {
        setPageLoading(false);
      }
    };

    fetchInitialData();
  }, [botId, get]);

  const handleAddSkill = () => setIsSkillModalVisible(true);
  const handleDeleteSkill = (id: number) => setSelectedSkills(prev => prev.filter(item => item !== id));

  const handleSave = async (isPublish = false) => {
    try {
      const values = await form.validateFields();

      const payload = {
        channels: selectedChannels,
        name: values.name, 
        introduction: values.introduction,
        team: values.group,
        enable_bot_domain: isDomainEnabled,
        bot_domain: isDomainEnabled ? botDomain : null,
        enable_ssl: isDomainEnabled ? enableSsl : false,
        enable_node_port: isPortMappingEnabled,
        node_port: isPortMappingEnabled ? nodePort : null,
        rasa_model: values.rasa_model,
        llm_skills: selectedSkills,
        is_publish: isPublish
      };

      await patch(`/bot_mgmt/bot/${botId}/`, payload);
      message.success(t(isPublish ? 'common.publishSuccess' : 'common.saveSuccess'));
    } catch (error) {
      console.error(error);
      message.error(t('common.saveFailed'));
    }
  };

  const iconType = (index: number) => {
    return index % 2 === 0 ? 'jishuqianyan' : 'theory'
  };

  const handleSaveAndPublish = () => handleSave(true);
  
  const toggleOnlineStatus = async () => {
    try {
      await patch(`/bot_mgmt/bot/${botId}/`, { online: !online });
      setOnline(prevOnline => !prevOnline);
      message.success(t('common.saveSuccess'));
    } catch (error) {
      message.error(t('common.saveFailed'));
    }
  };

  const getTypeIcon = (name: string) => {
    return name === 'enterprise_wechat' ? 'qiwei' : name === 'ding_talk' ? 'dingding1' : 'wangye'
  }

  const menu = (
    <Menu style={{ width: 300 }}>
      <Menu.Item key="info" disabled style={{ whiteSpace: 'normal', opacity: 1, cursor: 'default' }}>
        <div>
          {t('studio.settings.publishTip')} {t('studio.settings.selectedParams')}
        </div>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="save_publish">
        <Button type="primary" style={{ width: '100%' }} onClick={handleSaveAndPublish}>
          {t('common.save')} & {t('common.publish')}
        </Button>
      </Menu.Item>
      <Menu.Item key="save_only">
        <Button style={{ width: '100%' }} onClick={() => handleSave(false)}>
          {t('common.saveOnly')}
        </Button>
      </Menu.Item>
      {online && (
        <Menu.Item key="offline" onClick={toggleOnlineStatus}>
          <div className="flex justify-end items-center">
            <span className="mr-[5px] text-gray-500">{t('studio.off')}</span>
            <Icon type="offline" />
          </div>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <div className="relative flex justify-center w-full">
      {pageLoading ? (
        <div className="min-h-[500px] flex justify-center items-center">
          <Spin size="large" className="absolute top-1/2 transform -translate-y-1/2" />
        </div>
      ) : (
        <div className="w-full sm:w-3/4 lg:w-2/3 xl:w-1/2">
          <div className="absolute top-0 right-0 flex items-center space-x-4">
            <Tag
              color={online ? 'green' : ''}
              className={`${styles.statusTag} ${online ? styles.online : styles.offline}`}
            >
              {online ? t('studio.on') : t('studio.off')}
            </Tag>
            <Dropdown overlay={menu} trigger={['click']}>
              <Button icon={<DownOutlined />} type="primary">
                {t('common.publish')}
              </Button>
            </Dropdown>
          </div>
          <div className="space-y-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{t('studio.information')}</h2>
              <div className="px-4 pt-[24px] border rounded-md shadow-sm">
                <Form form={form} labelCol={{ flex: '0 0 128px' }} wrapperCol={{ flex: '1' }}>
                  <Form.Item
                    label={t('studio.form.name')}
                    name="name"
                    rules={[{ required: true, message: `${t('common.input')} ${t('studio.form.name')}` }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label={t('studio.form.group')}
                    name="group"
                    rules={[{ required: true, message: `${t('common.input')} ${t('studio.form.group')}` }]}
                  >
                    <Select mode="multiple">
                      {groups.map((group) => (
                        <Option key={group.id} value={group.id}>
                          {group.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label={t('studio.form.introduction')}
                    name="introduction"
                    rules={[{ required: true, message: `${t('common.input')}${t('studio.form.introduction')}` }]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <Form.Item
                    label={t('studio.form.model')}
                    name="rasa_model"
                    rules={[{ required: true, message: `${t('common.input')} ${t('studio.form.model')}` }]}
                  >
                    <Select>
                      {rasaModels.map((model) => (
                        <Option key={model.id} value={model.id} disabled={!model.enabled}>
                          {model.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Form>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{t('skill.menu')}</h2>
              <div className="px-4 pt-4 border rounded-md shadow-sm">
                <Form.Item className="mb-0">
                  <div className="mb-4 flex justify-end">
                    <Button type="dashed" onClick={handleAddSkill}>
                      + {t('common.add')}
                    </Button>
                  </div>
                  <div className={`grid ${selectedSkills.length ? 'mb-4' : ''}`}>
                    {selectedSkills.map((id, index) => {
                      const skill = skills.find((s) => s.id === id);
                      return skill ? (
                        <div key={id} className={`rounded-md px-4 py-2 flex items-center justify-between ${styles.cardFillColor}`}>
                          <div className='flex items-center'>
                            <Icon type={iconType(index)} className="text-xl mr-2" />
                            <span>{skill.name}</span>
                          </div>
                          <div className='hover:text-blue-500 hover:bg-blue-100 p-1 rounded'>
                            <DeleteOutlined onClick={() => handleDeleteSkill(id)} />
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </Form.Item>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{t('studio.channel.title')}</h2>
              <div className="px-4 pt-4 border rounded-md shadow-sm">
                <Form.Item className="mb-4">
                  <div className="grid gap-3 grid-cols-3">
                    {channels.map((channel) => {
                      const isSelected = selectedChannels.includes(channel.id);
                      return (
                        <div
                          key={channel.id}
                          onClick={() => {
                            setSelectedChannels((prev) => 
                              isSelected 
                                ? prev.filter(id => id !== channel.id)
                                : [...prev, channel.id]
                            );
                          }}
                          className={`relative flex items-center cursor-pointer rounded-md p-4 text-center ${isSelected 
                            ? styles.selectedCommonItem
                            : styles.cardFillColor}` 
                          }
                        >
                          <Icon type={getTypeIcon(channel.name)} className="text-3xl mr-[5px]" />
                          {channel.name}
                          {isSelected && <CheckOutlined className={`${styles.checkedIcon}`} />}
                        </div>
                      );
                    })}
                  </div>
                </Form.Item>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">{t('studio.settings.title')}</h2>
              <div className="px-4 pt-4 border rounded-md shadow-sm">
                <div className="mb-5">
                  <div className="flex items-center justify-between">
                    <span>{t('studio.settings.domain')}</span>
                    <Switch size="small" checked={isDomainEnabled} onChange={(checked) => {
                      setIsDomainEnabled(checked);
                      if (!checked) {
                        setBotDomain('');
                        setEnableSsl(false);
                      }
                    }} />
                  </div>
                  {isDomainEnabled && (
                    <>
                      <Form.Item className='mt-4 mb-0'>
                        <div className='w-full flex items-center'>
                          <Input 
                            className='flex-1 mr-3'
                            placeholder={`${t('common.inputMsg')} ${t('studio.settings.domain')}`} 
                            value={botDomain}
                            onChange={(e) => setBotDomain(e.target.value)}
                          />
                          <Checkbox 
                            checked={enableSsl} 
                            onChange={(e) => setEnableSsl(e.target.checked)}
                          >
                            {t('studio.settings.enableSsl')}
                          </Checkbox>
                        </div>
                      </Form.Item>
                    </>
                  )}
                </div>
                <div className="border-t py-4">
                  <div className="flex items-center justify-between">
                    <span>{t('studio.settings.portMapping')}</span>
                    <Switch size="small" checked={isPortMappingEnabled} onChange={(checked) => {
                      setIsPortMappingEnabled(checked);
                      if (!checked) {
                        setNodePort(5005);
                      }
                    }} />
                  </div>
                  {isPortMappingEnabled && (
                    <Form.Item className="mt-4 mb-0">
                      <Input 
                        placeholder={`${t('common.inputMsg')} ${t('studio.settings.portMapping')}`} 
                        value={nodePort}
                        onChange={(e) => setNodePort(Number(e.target.value))}
                      />
                    </Form.Item>
                  )}
                </div>
              </div>
            </div>
          </div>
          <OperateModal
            visible={isSkillModalVisible}
            okText={t('common.confirm')}
            cancelText={t('common.cancel')}
            onOk={(newSelectedSkills) => {
              setSelectedSkills(newSelectedSkills);
              setIsSkillModalVisible(false);
            }}
            onCancel={() => setIsSkillModalVisible(false)}
            items={skills}
            selectedItems={selectedSkills}
            title={t('studio.settings.selectSkills')}
          />
        </div>
      )}
    </div>
  );
};

export default StudioSettingsPage;