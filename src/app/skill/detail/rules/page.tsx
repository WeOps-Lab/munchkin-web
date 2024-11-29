'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { Table, Input, Spin, Drawer, Button, Pagination, Tag, Switch } from 'antd';
import { ClockCircleOutlined, PlusOutlined } from '@ant-design/icons';
import useApiClient from '@/utils/request';
import { useTranslation } from '@/utils/i18n';
import { useLocalizedTime } from '@/hooks/useLocalizedTime';
import AddRuleModal from './addRuleModal';

const { Search } = Input;

interface SkillRule {
  key: string;
  title: string;
  createdTime: string;
  user: string;
  state: boolean;
  rule: string;
  details?: any;
}

const SkillRules: React.FC = () => {
  const { t } = useTranslation();
  const { get, post } = useApiClient();
  const { convertToLocalizedTime } = useLocalizedTime();
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState<SkillRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSkillRule, setSelectedSkillRule] = useState<SkillRule | null>(null);
  const [skillRuleLoading, setSkillRuleLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const fetchSkillRules = useCallback(async (searchText = '', page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const params: any = { page, page_size: pageSize };
      if (searchText) params.search = searchText;

      const res = await get('/model_provider_mgmt/rule/', { params });
      setData(res.items.map((item: any, index: number) => ({
        key: index.toString(),
        title: item.title,
        createdTime: item.created_at,
        user: item.username,
        state: item.state,
        rule: item.rule,
      })));
      setTotal(res.count);
    } catch (error) {
      console.error(`${t('common.fetchFailed')}:`, error);
    }
    setLoading(false);
  }, [get]);

  useEffect(() => {
    fetchSkillRules();
  }, [fetchSkillRules]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });
    fetchSkillRules(value, 1, pagination.pageSize);
  };

  const handleDetailClick = async (record: SkillRule) => {
    setSelectedSkillRule(record);
    setDrawerVisible(true);
    setSkillRuleLoading(true);

    try {
      const details = await get(`/bot_mgmt/skill_rules/${record.key}`);
      setSelectedSkillRule({
        ...record,
        details,
      });
    } catch (error) {
      console.error(`${t('common.fetchFailed')}:`, error);
    } finally {
      setSkillRuleLoading(false);
    }
  };

  const handleTableChange = (page: number, pageSize?: number) => {
    const newPagination = {
      current: page,
      pageSize: pageSize || pagination.pageSize,
    };
    setPagination(newPagination);
    fetchSkillRules(searchText, newPagination.current, newPagination.pageSize);
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setPagination({ current, pageSize: size });
    fetchSkillRules(searchText, current, size);
  };

  const handleSwitchChange = async (checked: boolean, record: SkillRule) => {
    try {
      await post(`/model_provider_mgmt/rule/${record.key}/update_state`, { state: checked });
      fetchSkillRules(searchText, pagination.current, pagination.pageSize);
    } catch (error) {
      console.error(`${t('common.updateFailed')}:`, error);
    }
  };

  const handleAdd = () => {
    setModalVisible(true);
  };

  const handleAddRule = async (values: any) => {
    try {
      await post('/model_provider_mgmt/rule/', {
        name: values.name,
        description: values.description,
        condition: {
          operator: values.conditions[0].operator,
          conditions: values.conditions.map((cond: any) => ({
            type: cond.type,
            obj: cond.obj,
            value: cond.value,
          })),
        },
        action: values.action,
        action_set: {
          skill_prompt: values.skill_prompt,
          knowledge_base_list: values.knowledge_base_list,
        },
      });
      setModalVisible(false);
      fetchSkillRules(searchText, pagination.current, pagination.pageSize);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: t('skill.rules.table.name'),
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: t('skill.rules.table.createdAt'),
      dataIndex: 'createdTime',
      key: 'createdTime',
      render: (text: string) => convertToLocalizedTime(text),
    },
    {
      title: t('skill.rules.table.creator'),
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: t('skill.rules.table.state'),
      dataIndex: 'state',
      key: 'state',
      render: (text: boolean, record: SkillRule) => (
        <Switch
          checked={text}
          onChange={(checked) => handleSwitchChange(checked, record)}
        />
      ),
    },
    {
      title: t('skill.rules.table.actions'),
      key: 'actions',
      render: (text: any, record: SkillRule) => (
        <>
          <Button type="link" onClick={() => handleDetailClick(record)}>
            {t('common.edit')}
          </Button>
          <Button type="link" danger onClick={() => console.log('Delete')}>
            {t('common.delete')}
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className='h-full flex flex-col'>
      <div className='mb-[20px] flex items-center justify-end'>
        <Search
          placeholder={`${t('common.input')}...`}
          allowClear
          onSearch={handleSearch}
          enterButton
          className='w-60 mr-2'
        />
        <Button icon={<PlusOutlined />} type="primary" onClick={handleAdd}>{t('common.add')}</Button>
      </div>
      <div className='flex-grow'>
        {loading ? (
          <div className='w-full flex items-center justify-center min-h-72'>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={data}
            columns={columns}
            pagination={false}
            scroll={{ y: 'calc(100vh - 400px)' }}
          />
        )}
      </div>
      <div className='fixed bottom-8 right-8'>
        {!loading && (
          <Pagination
            total={total}
            showSizeChanger
            hideOnSinglePage
            current={pagination.current}
            pageSize={pagination.pageSize}
            onChange={handleTableChange}
            onShowSizeChange={handlePageSizeChange}
          />
        )}
      </div>
      <Drawer
        title={selectedSkillRule && (
          <div className="flex items-center">
            <span>{selectedSkillRule.user}</span>
            <Tag color="blue" className='ml-4' icon={<ClockCircleOutlined />}>{selectedSkillRule.rule}</Tag>
          </div>
        )}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width={680}
      >
        {skillRuleLoading ? (
          <div className='flex justify-center items-center w-full h-full'>
            <Spin />
          </div>
        ) : (
          selectedSkillRule && selectedSkillRule.details && (
            <div>
              <p>{selectedSkillRule.details.description}</p>
            </div>
          )
        )}
      </Drawer>
      <AddRuleModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleAddRule}
      />
    </div>
  );
};

export default SkillRules;
