import React, { useRef, useState, useEffect } from 'react';
import { Form, Input, Select, Button, Space, Row, Col } from 'antd';
import { MinusCircleFilled, PlusOutlined } from '@ant-design/icons';
import useApiClient from '@/utils/request';
import { useTranslation } from '@/utils/i18n';
import { KnowledgeBase, KnowledgeBaseRagSource } from '@/types/skill';
import styles from './index.module.less';
import OperateModal from '@/components/operate-modal';
import KnowledgeBaseSelector from '@/components/skill/knowledgeBaseSelector';

const { Option } = Select;

interface AddRuleModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
}

const AddRuleModal: React.FC<AddRuleModalProps> = ({
  visible,
  onCancel,
  onOk,
}) => {
  const { t } = useTranslation();
  const { get } = useApiClient();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const addButtonRef = useRef<{ add: () => void }>({ add: () => { null } });
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [ragSources, setRagSources] = useState<KnowledgeBaseRagSource[]>([]);
  const [selectedKnowledgeBases, setSelectedKnowledgeBases] = useState<number[]>([]);
  const [conditionsCount, setConditionsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await get('/knowledge_mgmt/knowledge_base/');
        setKnowledgeBases(data);
      } catch (error) {
        console.error(t('common.fetchFailed'), error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [get]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // 将选择的知识库添加到提交的数据中
      values.knowledge_base_list = selectedKnowledgeBases;
      onOk(values);
      form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <OperateModal
      title={t('skill.rules.add')}
      visible={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
        setConditionsCount(0);
      }}
      onOk={handleOk}
      loading={loading}
      width={800}
    >
      <Form form={form} layout="horizontal" labelCol={{ flex: '0 0 108px' }} wrapperCol={{ flex: '1' }}>
        <Form.Item
          name="name"
          label={t('skill.rules.name')}
          rules={[{ required: true, message: t('common.inputRequired') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label={t('skill.rules.description')}
          rules={[{ required: true, message: t('common.inputRequired') }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label={t('skill.rules.condition')} required>
          <section className={`p-4 rounded-md ${styles.ruleContainer}`}>
            <Row gutter={16} className={`flex items-center ${styles.conditionOperatorColumn}`}>
              <Col span={4} className="relative flex flex-col items-center">
                <Form.Item
                  name="conditionsOperator"
                  className="my-auto z-10 w-full"
                >
                  {(conditionsCount > 1) && (
                    <Select style={{ width: '80px' }}>
                      <Option value="or">OR</Option>
                      <Option value="and">AND</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col span={20} className='relative'>
                <Form.List name="conditions">
                  {(fields, { add, remove }) => {
                    addButtonRef.current.add = () => {
                      add();
                      setConditionsCount(fields.length + 1);
                    };
                    return (
                      <>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space
                            key={key}
                            align="baseline"
                            className={`flex items-center relative ${styles.conditionRow}`}
                          >
                            <Form.Item
                              {...restField}
                              name={[name, 'questioner']}
                              rules={[{ required: true, message: t('common.inputRequired') }]}
                            >
                              <Input className="w-30" placeholder={t('skill.rules.questioner')} />
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'type']}
                              rules={[{ required: true, message: t('common.inputRequired') }]}
                            >
                              <Select className="w-35" placeholder={`${t('common.inputMsg')}${t('skill.rules.type')}`}>
                                <Option value="ding_talk">Ding Talk</Option>
                                <Option value="enterprise_wechat">Enterprise Wechat</Option>
                              </Select>
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'operator']}
                              rules={[{ required: true, message: t('common.inputRequired') }]}
                            >
                              <Select className="w-35" placeholder={`${t('common.inputMsg')}${t('skill.rules.operator')}`}>
                                <Option value="include">Include</Option>
                                <Option value="exclude">Exclude</Option>
                              </Select>
                            </Form.Item>
                            <Form.Item
                              {...restField}
                              name={[name, 'value']}
                              rules={[{ required: true, message: t('common.inputRequired') }]}
                            >
                              <Input className="w-30" placeholder={`${t('common.inputMsg')}${t('skill.rules.value')}`} />
                            </Form.Item>
                            <MinusCircleFilled
                              className="text-gray-400"
                              onClick={() => {
                                remove(name);
                                setConditionsCount(fields.length - 1);
                              }}
                            />
                          </Space>
                        ))}
                      </>
                    );
                  }}
                </Form.List>
              </Col>
            </Row>
            <Button
              type="dashed"
              className="mt-2"
              onClick={() => addButtonRef.current.add()}
              block
              icon={<PlusOutlined />}
            >
              {t('skill.rules.addCondition')}
            </Button>
          </section>
        </Form.Item>
        <Form.Item
          name="action"
          label={t('skill.rules.action')}
          rules={[{ required: true, message: t('common.inputRequired') }]}
        >
          <Select rootClassName='mb-5' placeholder={t('skill.rules.action')} className="w-full">
            <Option value={0}>Use defined knowledge and prompt</Option>
          </Select>
          <div className={`p-4 rounded-md ${styles.ruleContainer}`}>
            <Form.Item
              name="skill_prompt"
              label={t('skill.rules.prompt')}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label={t('skill.rules.knowledgeBase')}
            >
              <KnowledgeBaseSelector
                showScore={false}
                ragSources={ragSources}
                setRagSources={setRagSources}
                knowledgeBases={knowledgeBases}
                selectedKnowledgeBases={selectedKnowledgeBases}
                setSelectedKnowledgeBases={setSelectedKnowledgeBases}
              />
            </Form.Item>
          </div>
        </Form.Item>
      </Form >
    </OperateModal>
  );
};

export default AddRuleModal;
