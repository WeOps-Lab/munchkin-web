import { useCallback } from 'react';
import { message } from 'antd';
import useApiClient from '@/utils/request';

const useSaveConfig = () => {
  const { post } = useApiClient();

  const validateConfig = useCallback((config: any) => {
    console.log('config', config);
    if (config.enable_semantic_chunk_parse && !config.semantic_chunk_parse_embedding_model) {
      message.error('Please select a semantic model when Semantic Chunk Parsing is enabled.');
      return false;
    }
    if (config.enable_ocr_parse && !config.ocr_model) {
      message.error('Please select an OCR model when OCR Enhancement is enabled.');
      return false;
    }
    return true;
  }, []);

  const saveConfig = useCallback(async (config: any) => {
    if (!validateConfig(config)) {
      return false;
    }
    try {
      await post('/knowledge_mgmt/knowledge_document/preprocess/', config);
      message.success('Configuration saved and preprocessing started');
      return true;
    } catch (error) {
      message.error('Failed to start preprocessing');
      return false;
    }
  }, [validateConfig, post]);

  return { saveConfig };
};

export default useSaveConfig;