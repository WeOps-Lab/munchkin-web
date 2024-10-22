'use client';

import React from 'react';
import EntityList from '@/components/entity-list';
import GenericModifyModal from '@/components/generic-modify-modal';
import SkillCard from '@/components/skill/skillCard';
import { Skill } from '@/types/skill';
import useGroups from '@/hooks/useGroups';

const initSkillForm = (form: any, groups: any) => {
  if (groups.length > 0) {
    form.setFieldsValue({ team: [groups[0].id] });
  }
};

const SkillPage: React.FC = () => {
  const { groups, loading } = useGroups();
  return (
    <EntityList<Skill>
      endpoint="/model_provider_mgmt/llm/"
      CardComponent={SkillCard}
      ModifyModalComponent={(props) => (
        <GenericModifyModal
          {...props}
          formType="skill"
          initForm={initSkillForm}
          groups={groups}
          loading={loading}
        />
      )}
      itemType="skills"
      itemTypeSingle="skill"
    />
  );
};

export default SkillPage;