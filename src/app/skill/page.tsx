'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Modal, message, Spin } from 'antd';
import { Skill } from '@/types/skill';
import useApiClient from '@/utils/request';
import ModifySkillModal from './modifySkillModal';
import SkillCard from '@/components/skill/skillCard';
import { useTranslation } from '@/utils/i18n';
import styles from './index.module.less'

const dummyData: Skill[] = [
  {
    id: 1,
    skillName: 'Skill Name',
    description: '这里是Skill的描述....',
    owner: 'kayla',
    group: 'WeOps',
    avatar: '/banner_bg_1.jpg',
  },
  {
    id: 2,
    skillName: 'Skill Name',
    description: '这里是Skill的描述....',
    owner: 'kayla',
    group: 'WeOps',
    avatar: '/banner_bg_2.jpg',
  },
  {
    id: 3,
    skillName: 'Skill Name',
    description: '这里是Skill的描述....',
    owner: 'kayla',
    group: 'WeOps',
    avatar: '/banner_bg_1.jpg',
  },
  {
    id: 4,
    skillName: 'Skill Name',
    description: '这里是Skill的描述....',
    owner: 'kayla',
    group: 'WeOps',
    avatar: '/banner_bg_2.jpg',
  },
  {
    id: 5,
    skillName: 'Skill Name',
    description: '这里是Skill的描述....',
    owner: 'kayla',
    group: 'WeOps',
    avatar: '/banner_bg_1.jpg',
  },
];

const SkillPage: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { get, post, patch, del } = useApiClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [skills, setSkills] = useState<Skill[]>(dummyData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSkill, setEditingSkill] = useState<null | Skill>(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const fetchSkills = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await get('/skill_mgmt/skills/');
  //       setSkills(Array.isArray(data) ? data : []);
  //     } catch (error) {
  //       message.error(t('common.fetchFailed'));
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchSkills();
  // }, [get]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddSkill = async (values: Skill) => {
    try {
      if (editingSkill) {
        await patch(`/skill_mgmt/skills/${editingSkill.id}/`, values);
        setSkills(skills.map(skill => skill.id === editingSkill?.id ? { ...skill, ...values } : skill));
        message.success(t('common.updateSuccess'));
      } else {
        const newSkill = await post('/skill_mgmt/skills/', values);
        setSkills([newSkill, ...skills]);
        message.success(t('common.addSuccess'));
      }
      setIsModalVisible(false);
      setEditingSkill(null);
    } catch (error) {
      message.error(t('common.saveFailed'));
    }
  };

  const handleDelete = (skillId: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this skill?',
      onOk: async () => {
        try {
          await del(`/skill_mgmt/skills/${skillId}/`);
          setSkills(skills.filter(skill => skill.id !== skillId));
          message.success(t('common.delSuccess'));
        } catch (error) {
          message.error(t('common.delFailed'));
        }
      },
    });
  };

  const handleMenuClick = (action: string, skill: Skill) => {
    if (action === 'edit') {
      setEditingSkill(skill);
      setIsModalVisible(true);
    } else if (action === 'delete') {
      handleDelete(skill.id);
    }
  };

  const filteredSkills = skills.filter((skill) =>
    skill.skillName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-12 w-full min-h-screen">
      <div className="flex justify-end mb-4">
        <Input 
          size="large"
          placeholder={`${t('common.search')}...`}
          style={{ width: '350px' }}
          onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
        />
      </div>
      <Spin spinning={loading}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            className={`shadow-md p-4 rounded-xl flex items-center justify-center cursor-pointer ${styles.addNew}`}
            onClick={() => { setIsModalVisible(true); setEditingSkill(null); }}
          >
            <div className="text-center">
              <div className="text-2xl">+</div>
              <div className="mt-2">{t('common.addNew')}</div>
            </div>
          </div>
          {filteredSkills.map((skill, index) => (
            <SkillCard key={skill.id} {...skill} index={index} onMenuClick={handleMenuClick} />
          ))}
        </div>
      </Spin>
      <ModifySkillModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onConfirm={handleAddSkill}
        initialValues={editingSkill}
      />
    </div>
  );
};

export default SkillPage;