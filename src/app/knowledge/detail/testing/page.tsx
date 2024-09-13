'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Input, Button, message, Spin, Empty } from 'antd';
import ConfigComponent from '@/components/knowledge/config';
import { ResultItem } from '@/types/knowledge';
import useApiClient from '@/utils/request';
import useFetchConfigData from '@/hooks/useFetchConfigData';
import styles from './index.module.less';

const { TextArea } = Input;

const TestingPage: React.FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { post } = useApiClient();
  const { configData, setConfigData, loading: configLoading } = useFetchConfigData(id);
  const [searchText, setSearchText] = useState<string>('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [applyLoading, setApplyLoading] = useState<boolean>(false);

  const getConfigParams = () => {
    return {
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
  };

  const handleTesting = async () => {
    const params = {
      knowledge_base_id: id,
      query: searchText,
      ...getConfigParams(),
    };
    if (!searchText.trim()) {
      message.error('Text cannot be empty. This field is required.');
      return false;
    }
    if (configData.candidate < configData.quantity) {
      message.error('Please input Candidate Quantity must be greater than Return Quantity');
      return false;
    }
    setLoading(true);
    try {
      const data = await post('/knowledge_mgmt/knowledge_document/testing', params);
      message.success('Testing completed successfully!');
      setResults(data);
    } catch (error) {
      message.error('Failed to complete testing.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyConfig = async () => {
    const params = getConfigParams();
    setApplyLoading(true);
    try {
      await post(`/knowledge_mgmt/knowledge_base/${id}/update_settings/`, params);
      message.success('Configuration applied successfully!');
    } catch (error) {
      message.error('Failed to apply configuration.');
      console.error(error);
    } finally {
      setApplyLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && searchText.trim()) {
      e.preventDefault();
      handleTesting();
    }
  };

  return (
    <Spin spinning={configLoading}>
      <div className="flex p-4">
        <div className="w-1/2 pr-4">
          <div className={`mb-4 border rounded-md ${styles.testingHeader}`}>
            <h2 className="text-lg font-semibold">Text</h2>
            <div className="relative">
              <TextArea
                placeholder="Enter text to search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={6}
              />
              <Button
                type="primary"
                className="absolute bottom-2 right-2"
                disabled={!searchText.trim()}
                onClick={handleTesting}
                loading={loading}
              >
                Testing
              </Button>
            </div>
          </div>
          <div className={`border rounded-md ${styles.testingHeader}`}>
            <h2 className="text-lg font-semibold mb-2">Config</h2>
            <div className="p-4">
              <ConfigComponent
                configData={configData}
                setConfigData={setConfigData}
              />
              <div className="flex justify-end mt-4">
                <Button type="primary" onClick={handleApplyConfig} loading={applyLoading}>
                  Apply Config
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 pl-4">
          <h2 className="text-lg font-semibold mb-2">Results</h2>
          <div className="space-y-4">
            {results.length > 0 ? (
              results.map((result, index) => (
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
              ))
            ) : (
              <Empty description="No Results" />
            )}
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default TestingPage;