import React from 'react';
import MarkdownRenderer from '@/components/markdown';

const MarkdownPage: React.FC = () => {
  return (
    <div>
      <MarkdownRenderer filePath="file/skill_api" />
    </div>
  );
};

export default MarkdownPage;
