import React from 'react';
import MarkdownRenderer from '@/components/markdown';

const MarkdownPage: React.FC = () => {
  return (
    <div>
      <MarkdownRenderer filePath="file/knowledge_api" />
    </div>
  );
};

export default MarkdownPage;
