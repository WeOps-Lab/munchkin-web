'use client';

import React from 'react';
import EntityCard from '@/components/entity-card';
import { Studio } from '@/types/studio';

interface StudioCardProps extends Studio {
  index: number;
  onMenuClick: (action: string, studio: Studio) => void;
}

const StudioCard: React.FC<StudioCardProps> = (props) => {
  const { id, name, introduction, created_by, team_name, team, index, online, onMenuClick } = props;
  const iconTypeMapping: [string, string] = ['jiqirenjiaohukapian', 'jiqiren'];

  return (
    <EntityCard 
      id={id} 
      name={name}
      introduction={introduction}
      created_by={created_by}
      team_name={team_name}
      team={team}
      index={index}
      online={online}
      onMenuClick={onMenuClick}
      redirectUrl="/studio/detail/settings"
      iconTypeMapping={iconTypeMapping}
    />
  );
};

export default StudioCard;