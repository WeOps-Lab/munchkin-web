'use client';

import React from 'react';
import EntityList from '@/components/entity-list';
import GenericModifyModal from '@/components/generic-modify-modal';
import SkillCard from '@/components/skill/skillCard';
import { Skill } from '@/types/skill';

const SkillPage: React.FC = () => {
  return (
    <EntityList<Skill>
      endpoint="/model_provider_mgmt/llm/"
      CardComponent={SkillCard}
      ModifyModalComponent={(props) => (
        <GenericModifyModal
          {...props}
          formType="skill"
        />
      )}
      itemType="skills"
      itemTypeSingle="skill"
    />
  );
};

export default SkillPage;
