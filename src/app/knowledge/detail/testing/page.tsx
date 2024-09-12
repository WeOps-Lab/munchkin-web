'use client';

import React, { useState } from 'react';
import { Input, Button } from 'antd';
import ConfigComponent from '@/components/knowledge/config';
import styles from './index.module.less';

const { TextArea } = Input;

const TestingPage: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedSearchType, setSelectedSearchType] = useState<string | null>(null);
  const [rerankModel, setRerankModel] = useState<boolean>(false);
  const [selectedRerankModel, setSelectedRerankModel] = useState<string | null>(null);
  const [weight, setWeight] = useState<number>(0.5);
  const [quantity, setQuantity] = useState<number>(10);
  const [candidate, setCandidate] = useState<number>(10);

  return (
    <div className="flex p-4">
      <div className="w-1/2 pr-4">
        <div className={`mb-4 border rounded-md ${styles.testingHeader}`}>
          <h2 className="text-lg font-semibold">Text</h2>
          <TextArea
            placeholder="Enter text to search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            rows={4}
          />
        </div>
        <div className={`border rounded-md ${styles.testingHeader}`}>
          <h2 className="text-lg font-semibold mb-2">Config</h2>
          <div className="p-4">
            <ConfigComponent
              selectedSearchType={selectedSearchType}
              setSelectedSearchType={setSelectedSearchType}
              rerankModel={rerankModel}
              setRerankModel={setRerankModel}
              selectedRerankModel={selectedRerankModel}
              setSelectedRerankModel={setSelectedRerankModel}
              weight={weight}
              setWeight={setWeight}
              quantity={quantity}
              setQuantity={setQuantity}
              candidate={candidate}
              setCandidate={setCandidate}
            />
            <Button type="primary">Apply Config</Button>
          </div>
        </div>
      </div>
      <div className="w-1/2 pl-4">
        <h2 className="text-lg font-semibold mb-2">Results</h2>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={`p-4 border rounded-md ${styles.resultsItem}`}>
              <div className="flex justify-between mb-2">
                <div>
                  <span className="text-blue-500"># {index + 1}</span>
                  <span className="ml-2 text-sm text-gray-500">| 分类名称</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>相关性: 0.8388</span>
                  <span>类型: 文本</span>
                  <span>更新时间: 0.057天</span>
                </div>
              </div>
              <p className="text-gray-800">WeOps工程流程自动化</p>
              <p className="text-gray-600">WeOps工程流程自动化旨在提高工程团队的工作效率和项目交付的准确性。</p>
              <p className="text-blue-500">WeOps工程流程自动化-AD.docx</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestingPage;