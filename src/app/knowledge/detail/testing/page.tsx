'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input, Button, message } from 'antd';
import ConfigComponent from '@/components/knowledge/config';
import { ResultItem } from '@/types/knowledge';
import useApiClient from '@/utils/request';
import styles from './index.module.less';

const { TextArea } = Input;

const TestingPage: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { post } = useApiClient();
  const [searchText, setSearchText] = useState<string>('');
  const [configData, setConfigData] = useState({
    selectedSearchTypes: [] as string[],
    rerankModel: false,
    selectedRerankModel: null as string | null,
    textSearchWeight: 0.5,
    vectorSearchWeight: 0.5,
    quantity: 10,
    candidate: 10,
    selectedEmbedModel: null as string | null,
  });
  const [results, setResults] = useState<ResultItem[]>([]);

  const handleApplyConfig = async () => {
    const params = {
      knowledge_base_id: id,
      query: searchText,
      embed_model: configData.selectedEmbedModel,
      enable_rerank: configData.rerankModel,
      rerank_model: configData.selectedRerankModel,
      enable_text_search: configData.selectedSearchTypes.includes('textSearch'),
      text_search_weight: configData.textSearchWeight,
      enable_vector_search: configData.selectedSearchTypes.includes('vectorSearch'),
      vector_search_weight: configData.vectorSearchWeight,
      rag_k: configData.quantity,
      rag_num_candidates: configData.candidate,
    };
    if (!searchText.trim()) {
      message.error('Text cannot be empty. This field is required.');
      return false;
    }
    if (configData.candidate < configData.quantity) {
      message.error('Please input Candidate Quantity must be greater than Return Quantity');
      return false;
    }
    try {
      const data = await post('/knowledge_mgmt/knowledge_document/testing', params);
      message.success('Configuration applied successfully!');
      setResults(data);
    } catch (error) {
      message.error('Failed to apply configuration.');
      console.error(error);
    }
  };

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
              configData={configData}
              setConfigData={setConfigData}
            />
            <div className="flex justify-end mt-4">
              <Button type="primary" onClick={handleApplyConfig}>Apply Config</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 pl-4">
        <h2 className="text-lg font-semibold mb-2">Results</h2>
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={result.id} className={`p-4 border rounded-md ${styles.resultsItem}`}>
              <div className="flex justify-between mb-2">
                <div className="border px-2 rounded-md">
                  <span className={`text-xs ${styles.activeTxt}`}># {index + 1}</span>
                  <span className="ml-2 text-xs">| Ranking</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Score: {result.score.toFixed(4)}</span>
                </div>
              </div>
              <p className={`text-sm ${styles.content} mb-2`}>{result.content}</p>
              <p className={`text-sm ${styles.activeTxt}`}>{result.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestingPage;